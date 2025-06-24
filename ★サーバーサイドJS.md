### はじめに - ServiceNowとサーバーサイドJavaScript

#### 1.1. ServiceNowにおけるスクリプトの役割

ServiceNowは、標準で提供されている機能だけでも非常に強力なプラットフォームです。しかし、組織独自の複雑な要件や業務プロセスに完全に対応するためには、標準機能だけでは限界があります。そこで登場するのが**スクリプト**です。

スクリプトを利用することで、ServiceNowの動作を細かくカスタマイズし、標準機能の枠を超えた自動化や機能拡張を実現できます。例えば、以下のようなことが可能になります。

*   特定の条件を満たした場合に、フィールドの値を自動で計算・設定する
*   レコードが作成・更新された際に、関連する別のレコードも自動で更新する
*   外部システムと連携し、データの送受信を行う
*   複雑な承認プロセスを自動化する
*   夜間に特定のデータを集計し、レポートを生成する

このように、スクリプトはServiceNowを組織のニーズに合わせて最適化するための、不可欠なツールと言えます。

##### クライアントサイド vs サーバーサイド

ServiceNowのスクリプトは、実行される場所によって大きく2種類に分けられます。

*   **クライアントサイドスクリプト**: ユーザーのWebブラウザ上で実行されます。
*   **サーバーサイドスクリプト**: ServiceNowのサーバー（データセンター）上で実行されます。

| 項目 | クライアントサイドスクリプト | サーバーサイドスクリプト |
| :--- | :--- | :--- |
| **実行場所** | ユーザーのWebブラウザ | ServiceNowのサーバー |
| **主な目的** | フォームの見た目や操作性の向上、入力値の即時検証など、ユーザー体験(UX)の向上 | データベースへのアクセス、ビジネスロジックの実行、セキュリティ制御、外部連携など |
| **主なAPI** | `g_form`, `g_user` | `GlideRecord`, `GlideSystem(gs)` |
| **代表的なスクリプト** | Client Script, UI Policy | Business Rule, Script Include |
| **特徴** | ・応答が速い<br>・ユーザーの操作に即座に反応できる<br>・データベースへの直接アクセスはできない | ・データベースを直接操作できる<br>・堅牢なセキュリティを維持できる<br>・処理に時間がかかる場合がある |

本ガイドでは、このうち**サーバーサイドJavaScript**に焦点を当てて、その仕組みと使い方を網羅的に解説していきます。サーバーサイドスクリプトをマスターすることは、ServiceNow開発者としてステップアップするための鍵となります。

#### 1.2. サーバーサイドJavaScriptの基本

ServiceNowのサーバーサイドスクリプトは、標準のJavaScriptをベースに、ServiceNow独自のAPI（便利な道具セット）が追加されたものです。

##### RhinoエンジンとECMAScript 5

ServiceNowのサーバーサイドJavaScriptは、**Mozilla Rhino** というエンジン上で動作しています。このエンジンは、**ECMAScript 5 (ES5)** というバージョンのJavaScript規格に基づいています。

これは非常に重要なポイントです。なぜなら、最近のWeb開発で一般的に使われている`let`や`const`による変数宣言、アロー関数 (`=>`)、`class`構文といった**ES6以降の新しい機能は、基本的に使用できない**からです。

変数宣言は`var`を使い、関数は`function`キーワードで定義する必要があります。この「少し古い書き方」に慣れることが、ServiceNowスクリプティングの第一歩です。

```javascript
// OKな書き方 (ES5)
var myVariable = 'Hello ServiceNow';
function myFunction(name) {
  return 'Hello, ' + name;
}

// NGな書き方 (ES6以降) - ServiceNowサーバーサイドではエラーになります
// let myVariable = 'Hello ServiceNow';
// const PI = 3.14;
// const myFunction = (name) => {
//   return `Hello, ${name}`;
// };
```

##### スコープの概念 (Global vs Scoped)

ServiceNowの開発には、「スコープ」という非常に重要な概念があります。スコープとは、開発したアプリケーションやスクリプトが格納される「部屋」のようなものです。

*   **Global (グローバルスコープ)**
    *   昔からある、ServiceNow全体の共有スペースです。
    *   ここに作成されたスクリプトや設定は、原則として他のすべてのアプリケーションからアクセスできます。
    *   自由度が高い反面、他の機能と名前が衝突したり、意図しない影響を与えてしまったりするリスクがあります（名前空間の汚染）。

*   **Scoped Application (スコープアプリケーション)**
    *   アプリケーションごとに独立した「専用の部屋」です。
    *   Scoped Appの中で作成されたスクリプトや設定は、デフォルトではそのアプリケーション内からしかアクセスできません。
    *   他のアプリケーションと隔離されているため、安全性が高く、他の開発による影響を受けにくいです。また、アプリケーションの配布や管理が容易になります。
    *   **現在のServiceNow開発では、Scoped Applicationで開発することが強く推奨されています。**

初心者のうちはGlobalスコープで学習を始めることもありますが、実践的な開発では必ずScoped Applicationを利用します。Scoped AppからGlobalのスクリプトを呼び出す場合は、`global.`という接頭辞が必要になるなど、いくつかルールがあります。

##### デバッグ方法

スクリプトが期待通りに動かない場合、何が起きているのかを調査する「デバッグ」が必要です。サーバーサイドスクリプトの基本的なデバッグ方法は、ログを出力することです。

**`gs.log()` と `gs.info()`**

`gs.log()`や`gs.info()`は、スクリプトの実行途中の変数の値やメッセージをシステムログに出力するための命令です。

*   **`gs.log(message, [source])`**: 汎用的なログ出力。第二引数でログのソース（発生源）を指定すると、後からフィルタリングしやすくなります。
*   **`gs.info(message)`**: 情報レベルのメッセージを出力します。他にも`gs.warn()` (警告)、`gs.error()` (エラー) があります。

```javascript
// 例: インシデントの優先度とカテゴリをログに出力する
var grIncident = new GlideRecord('incident');
if (grIncident.get('INC0010005')) { // 特定のインシデントレコードを取得
  var priority = grIncident.getValue('priority');
  var category = grIncident.getValue('category');

  // 変数の値をログに出力
  gs.info('インシデント ' + grIncident.getValue('number') + ' の優先度は ' + priority + ' です。');
  gs.log('カテゴリ情報', 'MyDebugScript', category);
}
```

出力されたログは、ナビゲーションメニューで **System Logs > System Log > All** と検索して確認できます。`Message`や`Source`でフィルタリングすると、目的のログを簡単に見つけられます。

デバッグは開発において必須のスキルです。まずは`gs.info()`を使って、処理がどこまで進んでいるか、変数の値がどうなっているかを確認する癖をつけましょう。

---

### 第2章: ServiceNowサーバーサイドAPIの基礎 - Glideクラス

ServiceNowのサーバーサイドスクリプトの強力さは、豊富に用意された**API (Application Programming Interface)** にあります。APIとは、ServiceNowの機能を簡単に利用するための「命令のセット」です。ここでは、特に重要な**Glideクラス**について解説します。

#### 2.1. GlideSystem (gs) - 最も基本的な便利屋

`gs` (GlideSystem) は、ServiceNowスクリプティングで最も頻繁に登場するオブジェクトです。システム情報、ユーザー情報、日時、ログ出力など、多岐にわたる便利な機能を提供してくれる「万能ツールボックス」のような存在です。

`gs`オブジェクトは、サーバーサイドスクリプトのどこからでも直接呼び出すことができます。

##### ユーザー情報の取得

現在スクリプトを実行しているユーザー（多くの場合、ログインしているユーザー）の情報を取得できます。

*   **`gs.getUser()`**: 現在のユーザーオブジェクト (`GlideUser`) を返します。このオブジェクトからさらに詳細な情報を取得できます。
*   **`gs.getUserID()`**: 現在のユーザーの`sys_id`（システム内で一意な32桁のID）を返します。
*   **`gs.getUserName()`**: 現在のユーザーのログイン名（例: `abel.tuter`）を返します。

```javascript
// 現在のユーザー情報を取得してログに出力する例
var userID = gs.getUserID();
var userName = gs.getUserName();
var user = gs.getUser();
var userDisplayName = user.getDisplayName(); // ユーザーの表示名
var userEmail = user.getEmail(); // ユーザーのメールアドレス

gs.info('実行ユーザーID: ' + userID);
gs.info('実行ユーザー名: ' + userName);
gs.info('実行ユーザー表示名: ' + userDisplayName);
gs.info('実行ユーザーEmail: ' + userEmail);

// ユーザーが特定のロールを持っているかチェックする
if (gs.hasRole('itil')) {
  gs.info('このユーザーはitilロールを持っています。');
} else {
  gs.info('このユーザーはitilロールを持っていません。');
}
```

##### 日時情報の操作

現在の日時を取得する機能もよく利用されます。

*   **`gs.now()`**: 現在日時を**ユーザーのタイムゾーン**で、`yyyy-MM-dd HH:mm:ss` 形式の**文字列**として返します。計算には不向きです。
*   **`gs.nowDateTime()`**: 現在日時を**システムの内部形式 (UTC)** で、`yyyy-MM-dd HH:mm:ss` 形式の**文字列**として返します。データベースへの保存に適しています。

**注意:** 日時の加算や減算などの複雑な計算を行う場合は、後述する`GlideDateTime`オブジェクトを使用するのがベストプラクティスです。

##### システムプロパティの取得

`gs.getProperty(property_name, [default_value])` を使うと、管理者が設定したシステムプロパティの値をスクリプト内から取得できます。これにより、スクリプト内に固定値（ハードコーディング）を書くのを避け、設定値を柔軟に変更できるようになります。

```javascript
// システムプロパティ 'my_app.default_assignment_group' の値を取得する
// もしプロパティが存在しない場合は、'Service Desk' をデフォルト値として使用する
var defaultGroup = gs.getProperty('my_app.default_assignment_group', 'Service Desk');
gs.info('デフォルトの担当グループは: ' + defaultGroup);
```

##### ログ出力

前述の通り、デバッグや処理記録のためにログを出力します。

*   `gs.log(message, [source])`
*   `gs.info(message)`
*   `gs.warn(message)`
*   `gs.error(message)`

##### イベントの生成

`gs.eventQueue(event_name, record_object, param1, param2)` は、ServiceNowのイベント処理システムに新しいイベントを登録します。このイベントをトリガーにして、メール通知やスクリプトアクション（別のスクリプト）を実行させることができます。

```javascript
// 例: インシデントが重大になったときに 'incident.escalated' というイベントを生成する
// current は Business Rule などで利用できる、現在処理中のレコードを指すオブジェクト
gs.eventQueue('incident.escalated', current, current.getValue('assigned_to'), current.getValue('assignment_group'));
```

##### メッセージの追加

サーバーサイドの処理結果を、ユーザーの画面上部にメッセージとして表示させることができます。主にBusiness Ruleで利用されます。

*   **`gs.addInfoMessage(message)`**: 青い情報メッセージを表示します。
*   **`gs.addErrorMessage(message)`**: 赤いエラーメッセージを表示します。
*   **`gs.addWarningMessage(message)`**: 黄色い警告メッセージを表示します。

```javascript
// 例: Business Rule内で使用
gs.addInfoMessage('インシデント ' + current.getValue('number') + ' が更新されました。');
if (current.getValue('priority') == 1) {
  gs.addErrorMessage('警告: このインシデントは最優先度です。');
}
```

#### 2.2. GlideRecord - データベース操作の要

**`GlideRecord`** は、ServiceNowのサーバーサイドスクリプトで**最も重要**なAPIです。これを使わずにサーバーサイド開発は語れません。`GlideRecord`は、ServiceNowのテーブルからレコードを**検索(Query)、作成(Create)、更新(Update)、削除(Delete)** するためのオブジェクトです。これらをまとめて**CRUD操作**と呼びます。

`GlideRecord`の基本的な使い方は、以下の流れになります。

1.  **オブジェクトの作成**: `var gr = new GlideRecord('table_name');` で、操作したいテーブルを指定してオブジェクトを作ります。
2.  **クエリの追加 (検索条件の指定)**: `gr.addQuery('field_name', 'operator', 'value');` などで、どのレコードを探すかの条件を追加します。
3.  **クエリの実行**: `gr.query();` で、データベースに問い合わせを実行します。
4.  **結果の処理**: `while (gr.next()) { ... }` や `if (gr.next()) { ... }` で、見つかったレコードを1件ずつ処理します。

##### 基本的なCRUD操作

ここでは、`incident`（インシデント）テーブルを例に、具体的な操作を見ていきましょう。

###### 1. クエリ (Query) と 読み取り (Read)

特定の条件に一致するレコードを検索し、その値を取得します。

*   **`addQuery(fieldName, operator, value)`**: 検索条件を追加します。`operator`を省略した場合は`=`（等しい）になります。
    *   例: `gr.addQuery('priority', 1);` // 優先度が1のレコード
    *   例: `gr.addQuery('short_description', 'CONTAINS', 'email');` // 件名に'email'を含むレコード
*   **`addEncodedQuery(encodedQueryString)`**: `&`や`^`などを使ったServiceNow独自のクエリ文字列で、より複雑な条件を指定します。リストビューのフィルタを右クリックして「Copy query」で取得できるので便利です。
    *   例: `gr.addEncodedQuery('active=true^priority=1');` // 有効(active) かつ 優先度が1
*   **`addOrCondition(fieldName, operator, value)`**: OR条件を追加します。
*   **`query()`**: データベースに問い合わせを実行します。
*   **`next()`**: 検索結果の次のレコードにカーソルを移動します。レコードが存在すれば`true`、存在しなければ`false`を返します。ループ処理でよく使われます。
*   **`get(sys_id)`**: 特定の`sys_id`を持つレコードを1件だけ取得します。成功すれば`true`を返します。
*   **`getValue(fieldName)`**: フィールドの生の値を返します（sys_idなど）。
*   **`getDisplayValue(fieldName)`**: フィールドの表示用の値を返します（参照フィールドの名前や選択リストのラベルなど）。

```javascript
// 例: カテゴリが 'Software' で、かつ優先度が1または2のアクティブなインシデントを検索し、その番号と担当者を表示する

var grIncident = new GlideRecord('incident');
grIncident.addQuery('active', true);
grIncident.addQuery('category', 'software');

// 優先度が1または2の条件を追加
var qc = grIncident.addQuery('priority', 1); // 最初の条件
qc.addOrCondition('priority', 2); // OR条件を追加

grIncident.query(); // クエリを実行

gs.info('検索結果件数: ' + grIncident.getRowCount()); // 見つかったレコード数をログに出力

// whileループで、見つかったレコードを1件ずつ処理
while (grIncident.next()) {
  var number = grIncident.getValue('number');
  var assignedTo = grIncident.getDisplayValue('assigned_to'); // 表示名を取得
  var shortDesc = grIncident.getValue('short_description');

  gs.info('インシデント番号: ' + number + ', 担当者: ' + assignedTo + ', 件名: ' + shortDesc);
}
```

###### 2. 作成 (Create)

新しいレコードをテーブルに作成します。

*   **`initialize()`**: 新しいレコードを作成するための準備をします。
*   **`setValue(fieldName, value)`**: フィールドに値を設定します。`gr.fieldName = value;` という書き方も可能です。
*   **`insert()`**: 設定した値で新しいレコードをデータベースに挿入します。成功すると、新しいレコードの`sys_id`を返します。

```javascript
// 例: 新しいインシデントレコードを作成する
var grNewIncident = new GlideRecord('incident');
grNewIncident.initialize(); // 新しいレコードの準備

// フィールドに値を設定
grNewIncident.setValue('caller_id', gs.getUserID()); // 依頼者を現在のユーザーに
grNewIncident.setValue('category', 'hardware');
grNewIncident.setValue('short_description', '新しいPCのセットアップ依頼');
grNewIncident.setValue('assignment_group', 'sys_id_of_hardware_group'); // ハードウェアグループのsys_idを指定

// レコードを挿入
var newIncidentSysId = grNewIncident.insert();

if (newIncidentSysId) {
  gs.info('新しいインシデントが作成されました。番号: ' + grNewIncident.getValue('number'));
} else {
  gs.error('インシデントの作成に失敗しました。');
}
```

###### 3. 更新 (Update)

既存のレコードの値を変更します。

*   まず、`get()`や`query()`/`next()`で更新したいレコードを取得します。
*   `setValue()`でフィールドの値を変更します。
*   **`update()`**: 変更をデータベースに保存します。成功すると、更新したレコードの`sys_id`を返します。

```javascript
// 例: 特定のインシデントの優先度を上げ、作業メモを追加する
var grUpdateIncident = new GlideRecord('incident');

// sys_idを使って更新対象のレコードを1件取得
if (grUpdateIncident.get('sys_id_of_incident_to_update')) {
  grUpdateIncident.setValue('priority', 1); // 優先度を1 (Critical) に変更
  grUpdateIncident.setValue('work_notes', '緊急対応のため優先度を上げました。'); // 作業メモを追加

  grUpdateIncident.update(); // 変更を保存

  gs.info('インシデント ' + grUpdateIncident.getValue('number') + ' を更新しました。');
} else {
  gs.error('更新対象のインシデントが見つかりませんでした。');
}
```

###### 4. 削除 (Delete)

既存のレコードを削除します。

*   まず、`get()`や`query()`/`next()`で削除したいレコードを取得します。
*   **`deleteRecord()`**: レコードをデータベースから削除します。成功すれば`true`を返します。

```javascript
// 例: 特定の条件に一致する古いインシデントを削除する
// 注意: 削除処理は元に戻せないので、慎重に実行してください。
var grDeleteIncident = new GlideRecord('incident');
grDeleteIncident.addQuery('state', 7); // 状態が 'Closed'
grDeleteIncident.addEncodedQuery('closed_at<javascript:gs.daysAgo(90)'); // 90日以上前にクローズされた
grDeleteIncident.query();

while (grDeleteIncident.next()) {
  gs.info('インシデント ' + grDeleteIncident.getValue('number') + ' を削除します。');
  // grDeleteIncident.deleteRecord(); // 実際に削除する場合はこの行のコメントを外す
}
```

**`GlideRecord`の重要ポイント**

*   `while (gr.next())` は複数件、 `if (gr.next())` は1件目の処理に使います。
*   `getRowCount()` は、`query()` の後に実行することで、ヒットしたレコードの件数を取得できます。
*   **ループ内での `update()` はパフォーマンスを著しく低下させる可能性があります。** 多数のレコードを更新する場合は、後述する高度なテクニックを検討する必要があります。
*   `getValue()` はDBに保存されている生の値を、`getDisplayValue()` は人間が見やすい表示用の値を取得します。用途に応じて使い分けましょう。

#### 2.3. GlideDateTime - 日時操作のスペシャリスト

ServiceNowでは日時の扱いは非常に重要ですが、タイムゾーンの違いなどがあり、単純な文字列操作では間違いが起こりがちです。そこで使用するのが **`GlideDateTime`** オブジェクトです。これを使うことで、タイムゾーンを意識した正確な日時の計算や書式設定が可能になります。

##### オブジェクトの生成

`GlideDateTime`オブジェクトは、いくつかの方法で生成できます。

```javascript
// 1. 現在の日時で生成
var gdtNow = new GlideDateTime(); // システムの現在日時(UTC)でオブジェクトを生成

// 2. 特定の日時文字列で生成
var gdtSpecific = new GlideDateTime('2023-12-25 10:00:00');

// 3. GlideRecordのフィールド値から生成
var gr = new GlideRecord('incident');
if (gr.get('sys_id_of_incident')) {
  var gdtOpenedAt = gr.opened_at.getGlideObject(); // opened_atフィールドからGlideDateTimeオブジェクトを取得
}
```

##### 日時の加算・減算

`GlideDateTime`の最も便利な機能の一つが、日時の計算です。

*   `addDays(numberOfDays)`: 日を加算
*   `addMonths(numberOfMonths)`: 月を加算
*   `addYears(numberOfYears)`: 年を加算
*   `addHours(numberOfHours)`: 時間を加算
*   `addMinutes(numberOfMinutes)`: 分を加算
*   `addSeconds(numberOfSeconds)`: 秒を加算

これらのメソッドは負の数を渡すことで、減算も可能です。

```javascript
// 例: SLAの期限を計算する
var gdt = new GlideDateTime(); // 現在日時
gs.info('現在日時: ' + gdt.getValue());

// 3日後の日時を計算
gdt.addDays(3);
gs.info('3日後: ' + gdt.getValue());

// 8時間前の日時を計算
gdt.addHours(-8);
gs.info('そこから8時間前: ' + gdt.getValue());
```

##### 日時間の差分計算

二つの`GlideDateTime`オブジェクト間の差分を計算するには、`GlideDateTime.subtract()` を使います。

```javascript
var gdtStart = new GlideDateTime('2023-12-20 09:00:00');
var gdtEnd = new GlideDateTime('2023-12-21 18:30:00');

// 差分を計算
var duration = GlideDateTime.subtract(gdtStart, gdtEnd); // GlideDurationオブジェクトが返る

gs.info('差分: ' + duration.getDisplayValue()); // 例: '1 Day 9 Hours 30 Minutes'
gs.info('差分（秒）: ' + duration.getNumericValue() / 1000); // ミリ秒単位なので1000で割る
```

##### 表示形式とタイムゾーン

`GlideDateTime`オブジェクトは、内部的には常にUTC（協定世界時）で日時を保持しています。これをユーザーが見やすい形式や特定のタイムゾーンに変換できます。

*   `getValue()`: システムの内部形式 `yyyy-MM-dd HH:mm:ss` (UTC) の文字列を返します。DBへの保存にはこれを使います。
*   `getDisplayValue()`: **現在のユーザーのタイムゾーンと表示設定** に基づいた文字列を返します。
*   `setDisplayValue(value, format)`: 指定した書式の文字列から日時を設定します。
*   `getByFormat(format)`: 指定した書式で日時文字列を取得します。
*   `setTZ(timezone)` / `getTZ()`: タイムゾーンを設定/取得します。

```javascript
var gdt = new GlideDateTime('2024-01-01 00:00:00'); // UTCの元旦
gs.info('内部値 (UTC): ' + gdt.getValue());
gs.info('ユーザータイムゾーンでの表示値: ' + gdt.getDisplayValue());

// 日本時間 (JST) に変換してみる
var tz = Packages.java.util.TimeZone.getTimeZone('Asia/Tokyo');
gdt.setTZ(tz);
gs.info('JSTでの表示値: ' + gdt.getDisplayValue()); // JSTはUTC+9なので、'2024-01-01 09:00:00' になる
```

#### 2.4. GlideAggregate - データ集計の達人

大量のレコードをループで回して件数を数えたり、合計値を計算したりするのは非常に非効率です。例えば、「カテゴリごとのインシデント件数」を知りたい場合、`GlideRecord`で全インシデントを取得してループ処理するのはサーバーに大きな負荷をかけます。

こんな時に使うのが **`GlideAggregate`** です。これは、データベース側で直接、**件数(COUNT)、合計(SUM)、平均(AVG)、最大(MAX)、最小(MIN)** といった集計処理を行うためのAPIです。

`GlideRecord`と似た使い方をしますが、レコードの個々のフィールド値を取得するのではなく、集計結果を取得する点が異なります。

##### 基本的な使い方

1.  **オブジェクトの作成**: `var ga = new GlideAggregate('table_name');`
2.  **集計関数の指定**: `ga.addAggregate('AGGREGATE_FUNCTION', 'field_name');` を使います。
    *   件数の場合: `ga.addAggregate('COUNT');`
    *   合計の場合: `ga.addAggregate('SUM', 'cost');` // costフィールドの合計
3.  **グループ化の指定**: `ga.groupBy('field_name');` で、集計の単位（例: カテゴリごと）を指定します。
4.  **クエリの実行**: `ga.query();`
5.  **結果の処理**: `while (ga.next()) { ... }` で結果を1行ずつ処理します。

##### 実践的な例: カテゴリごとのインシデント数を集計する

```javascript
var ga = new GlideAggregate('incident');
ga.addQuery('active', true); // アクティブなインシデントのみ対象
ga.addAggregate('COUNT');    // レコード件数を数える
ga.groupBy('category');      // カテゴリでグループ化する
ga.query();                  // 集計クエリを実行

gs.info('--- カテゴリ別インシデント件数 ---');
while (ga.next()) {
  var category = ga.getDisplayValue('category'); // グループ化したフィールドの値を取得
  var count = ga.getAggregate('COUNT');         // 集計結果を取得

  // カテゴリが空でない場合のみ表示
  if (category) {
    gs.info(category + ': ' + count + '件');
  }
}
```

このスクリプトは、データベース上で直接「カテゴリごとの件数」を計算させるため、`GlideRecord`で全件取得するよりも**圧倒的に高速**です。

##### SUM, AVG, MAX, MINの利用例

```javascript
// 資産(alm_asset)テーブルで、モデルカテゴリごとのコストの合計と平均を計算する
var gaCost = new GlideAggregate('alm_asset');
gaCost.addAggregate('SUM', 'cost'); // costの合計
gaCost.addAggregate('AVG', 'cost'); // costの平均
gaCost.groupBy('model_category');   // モデルカテゴリでグループ化
gaCost.query();

while (gaCost.next()) {
  var modelCategory = gaCost.getDisplayValue('model_category');
  var totalCost = gaCost.getAggregate('SUM', 'cost');
  var averageCost = gaCost.getAggregate('AVG', 'cost');

  gs.info('モデルカテゴリ: ' + modelCategory);
  gs.info('  合計コスト: ' + totalCost);
  gs.info('  平均コスト: ' + averageCost);
}
```

大量データの集計やレポート作成時には、`GlideRecord`ではなく`GlideAggregate`を積極的に利用することが、パフォーマンスの良いスクリプトを書くための重要なテクニックです。

---

### 第3章: 主要なサーバーサイドスクリプトの種類と使い方

ServiceNowには、特定の目的やタイミングで実行される、様々な種類のサーバーサイドスクリプトがあります。ここでは、開発で頻繁に使用される主要なものを、具体的な使い方と共に解説します。

#### 3.1. Business Rule - ビジネスロジックの中核

**Business Rule** は、レコードがデータベースに対して作成(Insert)、更新(Update)、削除(Delete)、または照会(Query)されたときに、サーバーサイドで自動的に実行されるスクリプトです。ServiceNowにおける**ビジネスロジックの自動化**の心臓部と言えます。

「インシデントの優先度が1になったら、担当グループを強制的にメジャーインシデントチームに変更する」といった、組織独自のルールを実装するのに最適です。

##### Business Ruleの設定要素

Business Ruleを作成する際には、主に以下の2つの要素を設定します。

1.  **いつ実行するか (When to run タブ)**
    *   **Table**: どのテーブルに対する操作を監視するか（例: `incident`）。
    *   **When**: データベース操作のどのタイミングで実行するか。**これは非常に重要です。**
        *   **`before`**: データベースにレコードが保存される**前**に実行。入力値の検証や、保存される値を動的に変更するのに最適です。例えば、`current.short_description = '変更後の値';` のように `current` オブジェクトを直接変更できます。
        *   **`after`**: データベースにレコードが保存された**後**に実行。作成/更新されたレコードの情報を使って、関連する別のレコードを更新するような処理に適しています。`current` オブジェクトの値を変更しても、すでに保存後なので元のレコードには反映されません。
        *   **`async`**: `after` と似ていますが、**非同期**で実行されます。ユーザーの操作とは切り離してバックグラウンドで処理されるため、外部API呼び出しや重い計算など、ユーザーを待たせたくない処理に使用します。
        *   **`display`**: フォームが画面に表示される**前**に実行されます。主に、サーバー側で取得した情報をクライアントスクリプトに渡すための `g_scratchpad` という特殊なオブジェクトに値を入れるために使います。
    *   **Operation (Action)**: どのデータベース操作をトリガーにするか（`Insert`, `Update`, `Delete`, `Query`）。複数選択可能です。
    *   **Filter Conditions**: スクリプトを実行する条件をGUIで設定します。例えば「`Priority` `is` `1 - Critical`」のように設定すると、条件に一致した場合のみスクリプトが実行されます。スクリプト内で `if` 文を書くよりも効率的です。

2.  **何を実行するか (Advanced タブ)**
    *   ここにJavaScriptコードを記述します。
    *   `Advanced` のチェックボックスをオンにすると、スクリプトエディタが表示されます。

##### `current` オブジェクトと `previous` オブジェクト

Business Ruleのスクリプト内では、2つの特別なオブジェクトが利用できます。

*   **`current`**: **現在処理されているレコード**を表す`GlideRecord`オブジェクトです。
    *   `current.getValue('field_name')` や `current.short_description` のようにして、フィールドの値にアクセスできます。
    *   `before` ルールでは、`current` の値を変更することで、データベースに保存される内容を書き換えることができます。（例: `current.priority = 1;`）
*   **`previous`**: **レコードが更新される前の値**を保持している`GlideRecord`オブジェクトです。
    *   **`Update` と `Delete` の `after`, `async` ルールでのみ利用可能**です。`Insert` 時には前の値が存在しないため使えません。
    *   `previous.getValue('field_name')` のようにして、変更前の値にアクセスできます。
    *   「担当グループが変更されたとき」のような、**値の変更を検知する**ロジックで非常に役立ちます。

```javascript
// "担当グループが変更されたとき" を検知するロジック (after update Business Rule)
if (current.assignment_group.changes()) { // .changes() は値が変更されたか判定する便利なメソッド
  gs.info('担当グループが ' + previous.getDisplayValue('assignment_group') + ' から ' + current.getDisplayValue('assignment_group') + ' に変更されました。');
}
```

##### 実践的な例

###### 例1 (before / insert): 優先度に応じて担当グループを自動設定する

インシデントが新規作成される際に、カテゴリが `Software` なら `Software` グループ、`Hardware` なら `Hardware` グループを自動的に割り当てます。

*   **Name**: `Set Assignment Group on Insert`
*   **Table**: `Incident [incident]`
*   **When**: `before`
*   **Insert**: `true`
*   **Advanced (Script)**:
    ```javascript
    (function executeRule(current, previous /*null when async*/) {

        // カテゴリに応じて担当グループのsys_idを設定
        if (current.getValue('category') == 'software') {
            // 'Software' グループのsys_id (実際にはシステムプロパティなどから取得するのが望ましい)
            current.setValue('assignment_group', 'sys_id_of_software_group');
        } else if (current.getValue('category') == 'hardware') {
            // 'Hardware' グループのsys_id
            current.setValue('assignment_group', 'sys_id_of_hardware_group');
        }

    })(current, previous);
    ```
    **ポイント**: `before` ルールなので、`current` の値を直接変更するだけでOKです。`update()` を呼ぶ必要はありません（呼んではいけません）。

###### 例2 (after / update): 課題解決時に、関連する問題レコードにコメントを追加する

インシデントの状態が `Resolved` (解決済み) に変更されたら、そのインシデントが関連付けられている `Problem` (問題) レコードに、解決した旨の作業メモを追記します。

*   **Name**: `Add Note to Problem on Incident Resolve`
*   **Table**: `Incident [incident]`
*   **When**: `after`
*   **Update**: `true`
*   **Filter Conditions**: `State` `changes to` `Resolved`
*   **Advanced (Script)**:
    ```javascript
    (function executeRule(current, previous /*null when async*/) {

        // このインシデントに関連する問題レコードがあるか確認
        if (!current.problem_id.nil()) { // problem_idフィールドが空でないか
            var grProblem = new GlideRecord('problem');
            // problem_idフィールドに入っているsys_idで問題レコードを取得
            if (grProblem.get(current.getValue('problem_id'))) {
                var note = '関連インシデント ' + current.getValue('number') + ' が解決されました。';
                grProblem.setValue('work_notes', note);
                grProblem.update(); // 関連レコードを更新
            }
        }

    })(current, previous);
    ```
    **ポイント**: `after` ルールなので、`current` レコードは既に保存済みです。その情報を使って、別のテーブル(`problem`)のレコードを `GlideRecord` で取得し、`update()` しています。

###### 例3 (display / g_scratchpad): ログインユーザーの所属部署をクライアントに渡す

フォームが表示される際に、ログインユーザーの所属部署(`department`)をサーバーで取得し、クライアントスクリプトで使えるように `g_scratchpad` に格納します。

*   **Name**: `Set Department on g_scratchpad`
*   **Table**: `Incident [incident]`
*   **When**: `display`
*   **Advanced (Script)**:
    ```javascript
    (function executeRule(current, previous /*null when async*/) {

        // g_scratchpadはグローバルなオブジェクト。プロパティを追加できる。
        // gs.getUserID()でログインユーザーのsys_idを取得し、ユーザーレコードを検索
        g_scratchpad.user_department = gs.getUser().getDepartmentID();
        g_scratchpad.user_department_display = gs.getUser().getDepartmentName(); // 表示名も渡しておくと便利

    })(current, previous);
    ```
    **この後、クライアントスクリプト側で以下のように利用できます。**
    ```javascript
    // Client Script (onLoad)
    function onLoad() {
       // g_scratchpadから値を受け取る
       if (g_scratchpad.user_department) {
          alert('あなたの部署は ' + g_scratchpad.user_department_display + ' です。');
          // 例えば、部署に応じて特定のフィールドを必須にするなどの処理が可能
          // g_form.setMandatory('some_field', true);
       }
    }
    ```
    `g_scratchpad` は、サーバーでしか取得できない情報を効率的にクライアントに渡すための強力な連携手段です。

#### 3.2. Script Include - 再利用可能なコードの保管庫

**Script Include** は、**再利用可能な関数やクラスを定義しておく場所**です。同じようなロジックを複数のBusiness RuleやUI Actionで書くのは非効率で、メンテナンスも大変になります。そのような共通処理をScript Includeにまとめておくことで、コードの**再利用性、保守性、可読性**が劇的に向上します。

「ユーザーの役職や所属部署を取得する処理」や「特定の計算ロジック」など、様々な場所から呼び出される可能性のあるコードは、Script Includeに記述するのがベストプラクティスです。

##### Class-based Script Include (推奨)

現在、最も一般的で推奨されるのが、クラスとしてScript Includeを作成する方法です。

*   **`Client callable`**: このチェックボックスをオンにすると、後述する`GlideAjax`を使ってクライアントサイドからこのScript Includeを呼び出せるようになります。セキュリティ上、必要な場合のみオンにしてください。

クラスベースのScript Includeは、以下のような構造を持ちます。

```javascript
// Script Include Name: MyUserUtils
// Application: Global (または任意のスコープ)
// Client callable: (チェックしない)

var MyUserUtils = Class.create();
MyUserUtils.prototype = {
    // initializeメソッド: new MyUserUtils() でオブジェクトが作成されたときに呼ばれるコンストラクタ
    initialize: function() {
    },

    // ユーザーがマネージャーかどうかを判定するメソッド
    // @param {string} userID - 判定したいユーザーのsys_id
    // @return {boolean} - マネージャーであればtrue、でなければfalse
    isManager: function(userID) {
        if (!userID) {
            return false;
        }

        var grUser = new GlideRecord('sys_user');
        if (grUser.get(userID)) {
            // managerフィールドが空でなければ、そのユーザーは誰かのマネージャー
            return !grUser.manager.nil();
        }
        return false;
    },

    // ユーザーの所属部署名を取得するメソッド
    // @param {string} userID - ユーザーのsys_id
    // @return {string} - 部署名 (見つからなければ空文字)
    getUserDepartmentName: function(userID) {
        if (!userID) {
            return '';
        }

        var grUser = new GlideRecord('sys_user');
        if (grUser.get(userID)) {
            // departmentは参照フィールドなので、getDisplayValue()で表示名を取得
            return grUser.getDisplayValue('department');
        }
        return '';
    },

    type: 'MyUserUtils'
};
```

**呼び出し方 (Business Ruleなどから):**

```javascript
// Script Includeをインスタンス化（オブジェクトを作成）してメソッドを呼び出す
var utils = new MyUserUtils();

// current.caller_id（インシデントの依頼者）がマネージャーかどうかをチェック
var isCallerManager = utils.isManager(current.getValue('caller_id'));

if (isCallerManager) {
    gs.info('このインシデントの依頼者はマネージャーです。');
}

// 依頼者の部署名を取得
var departmentName = utils.getUserDepartmentName(current.getValue('caller_id'));
gs.info('依頼者の部署: ' + departmentName);
```

##### Client callable と GlideAjax

Script Includeをクライアントから呼び出せるように `Client callable` にチェックを入れると、**`GlideAjax`** というクライアントAPIと連携できます。これにより、ページをリロードすることなく、サーバー側の情報を動的に取得してフォームに反映させる、といった非同期通信が可能になります。

**1. Script Include側 (サーバー)**
`AbstractAjaxProcessor` を継承し、メソッド名の先頭に `ajaxFunction_` を付けます（この命名規則は古いですが、互換性のために残っています。新しい方式では不要ですが、ここでは一般的な例を示します）。

```javascript
// Script Include Name: UserInfoAjax
// Client callable: true
// Application: Global

var UserInfoAjax = Class.create();
// AbstractAjaxProcessorを継承する
UserInfoAjax.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {

    // ユーザー情報を取得するAjax関数
    getUserDetails: function() {
        var userID = this.getParameter('sysparm_user_id'); // クライアントから渡されたパラメータを取得
        var result = {}; // 結果を格納するJSONオブジェクト

        var grUser = new GlideRecord('sys_user');
        if (grUser.get(userID)) {
            result.email = grUser.getValue('email');
            result.phone = grUser.getValue('phone');
            result.department = grUser.getDisplayValue('department');
        }

        // 結果をJSON形式の文字列で返す
        return new JSON().encode(result);
    },

    type: 'UserInfoAjax'
});
```

**2. Client Script側 (クライアント)**

```javascript
// Client Script (onChange of 'caller_id' field)
function onChange(control, oldValue, newValue, isLoading) {
    if (isLoading || newValue === '') {
        return;
    }

    // GlideAjaxを呼び出す準備
    var ga = new GlideAjax('UserInfoAjax'); // Script Include名を指定
    ga.addParam('sysparm_name', 'getUserDetails'); // 呼び出すメソッド名を指定
    ga.addParam('sysparm_user_id', newValue); // パラメータを渡す

    // サーバーからの応答を非同期で受け取る (コールバック関数)
    ga.getXML(function(response) {
        var answer = response.responseXML.documentElement.getAttribute("answer");
        if (answer) {
            var userInfo = JSON.parse(answer); // JSON文字列をオブジェクトに戻す

            // 取得した情報でフォームの値を設定
            g_form.setValue('u_caller_email', userInfo.email); // (例: u_caller_emailというカスタムフィールド)
            g_form.setValue('u_caller_phone', userInfo.phone);
        }
    });
}
```
この連携により、インシデントフォームで依頼者を変更すると、ページ全体を再読み込みすることなく、そのユーザーのメールアドレスや電話番号がフォームに自動的に入力される、といった動的なUIが実現できます。

#### 3.3. UI Action - ボタンやリンクからの処理実行

**UI Action** は、フォームやリストの上部、あるいは関連リンクなどに表示される**ボタン、リンク、コンテキストメニュー項目**を定義するものです。ユーザーがこれらをクリックしたときに、サーバーサイドまたはクライアントサイドのスクリプトを実行させることができます。

「インシデントをエスカレーションする」「承認」「却下」といった、ユーザーの能動的な操作をトリガーとする処理の実装に使われます。

##### サーバーサイドUI Action

最もシンプルなUI Actionは、サーバーサイドのみで完結する処理です。

*   **`Client` チェックボックス**: **オフ**にします。
*   **`Onclick`**: 空のままにします。
*   **`Script`**: 実行したいサーバーサイドスクリプトを記述します。Business Ruleと同様に `current` オブジェクトが使えます。

##### 実践的な例: インシデントを「エスカレーション」するボタン

クリックすると、インシデントの優先度を1段階上げ、緊急度が常に `High` になり、作業メモにその旨を記録するボタンを作成します。

*   **Name**: `Escalate`
*   **Table**: `Incident [incident]`
*   **Action name**: `escalate_incident` (ユニークな内部名)
*   **Show insert / Show update**: `true` (既存レコードに表示)
*   **Form button**: `true` (フォーム上部にボタンとして表示)
*   **Condition**: `current.priority > 1 && current.state != 7` (優先度が1より高く、クローズされていない場合にのみ表示)
*   **Client**: `false` (チェックしない)
*   **Script**:
    ```javascript
    (function executeServerAction() {
        // 現在の優先度を取得し、1段階上げる (値が小さいほど高い)
        var newPriority = parseInt(current.getValue('priority'), 10) - 1;

        // 1より小さくならないようにする
        if (newPriority < 1) {
            newPriority = 1;
        }

        current.setValue('priority', newPriority);
        current.setValue('urgency', 1); // 緊急度を 1 - High に設定
        current.setValue('work_notes', 'インシデントが ' + gs.getUserName() + ' によってエスカレーションされました。');

        // 変更を保存
        current.update();

        // ユーザーにメッセージを表示し、フォームを再読み込み
        gs.addInfoMessage('インシデント ' + current.getValue('number') + ' がエスカレーションされました。');
        action.setRedirectURL(current); // 現在のレコードのフォームにリダイレクト（再表示）

    })();
    ```

##### クライアントサイドとの連携

`Client` チェックボックスをオンにすると、クライアントサイドの処理とサーバーサイドの処理を組み合わせることができます。

*   **`Client` チェックボックス**: **オン**にします。
*   **`Onclick`**: 実行したい**クライアントサイドの関数名**を記述します。
*   **`Script`**: `Onclick`で指定した関数と、サーバーサイドで実行するコードの両方を記述します。

**重要なのは `gsftSubmit()`** という関数です。クライアントサイドの関数内でこの`gsftSubmit()`を呼び出すと、フォームがサーバーに送信され、UI Actionのサーバーサイド部分のスクリプトが実行されます。

##### 実践的な例: 確認ダイアログを表示してからサーバー処理を実行する

ボタンクリック時に「本当にクローズしますか？」という確認ダイアログを出し、「OK」が押された場合のみ、サーバー側でレコードをクローズ状態にする処理を実行します。

*   **Name**: `Close Incident with Confirmation`
*   **Table**: `Incident [incident]`
*   **Form button**: `true`
*   **Client**: `true` (チェックを入れる)
*   **Onclick**: `closeIncidentWithConfirm();`
*   **Script**:
    ```javascript
    // === クライアントサイドの処理 ===
    function closeIncidentWithConfirm() {
        // 必須フィールドが入力されているかなどのクライアントサイド検証もここで行える
        if (g_form.getValue('close_notes') == '') {
            alert('クローズメモは必須です。');
            return false; // falseを返すとサーバーへの送信を中止する
        }

        // 確認ダイアログを表示
        if (confirm('このインシデントを本当にクローズしますか？')) {
            // OKが押されたら、サーバーサイドの処理を呼び出す
            // 第3引数にUI Actionの 'Action name' を指定する
            gsftSubmit(null, g_form.getFormElement(), 'close_incident_action_name'); // 'close_incident_action_name' はこのUI ActionのAction nameフィールドの値
        }
    }


    // === サーバーサイドの処理 ===
    // gsftSubmitが呼ばれた後に、この部分が実行される
    if (typeof window == 'undefined') {
        serverClose();
    }

    function serverClose() {
        current.setValue('state', 7); // 7は 'Closed'
        // close_code と close_notes はクライアント側で入力されている前提
        // current.setValue('close_code', g_form.getValue('close_code')); // この書き方はNG
        // サーバーサイドでは g_form は使えない。current を使う。
        // close_notesはフォームで入力された値がcurrentに反映されている。

        current.update();
        action.setRedirectURL(current);
    }
    ```
    `if (typeof window == 'undefined')` というおまじないは、「ブラウザ(windowオブジェクト)が存在しない環境、つまりサーバーサイドで実行されている場合」という条件分岐です。これにより、クライアント用の関数とサーバー用のコードを一つのスクリプト内に共存させています。

#### 3.4. Scheduled Script Execution (Scheduled Job) - 定期的なバッチ処理

**Scheduled Script Execution**（通称: Scheduled Job）は、指定したスケジュールに基づいてサーバーサイドスクリプトを**定期的に自動実行**するための機能です。

夜間や週末など、システムの利用者が少ない時間帯に、以下のようなバッチ処理を実行するのに使用されます。

*   一定期間更新のないレコードを自動的にクローズする
*   データを集計してレポートテーブルに格納する
*   外部システムと定期的にデータを同期する
*   不要になった一時ファイルをクリーンアップする

##### 設定項目

*   **Name**: ジョブの分かりやすい名前。
*   **Run**: 実行する頻度（`Daily`, `Weekly`, `Monthly`, `Periodically` (N時間/分/秒ごと), `Once`, `On Demand`）。
*   **Time / Day / Month** など: `Run`の設定に応じた詳細なスケジュール。
*   **Run this script**: 実行したいサーバーサイドスクリプトを記述します。

##### 実践的な例: 30日以上更新のない「解決済み」インシデントを自動でクローズする

多くの組織では、インシデントを「解決済み(Resolved)」にした後、ユーザーからの異議申し立てがなければ一定期間後に自動で「クローズ(Closed)」にする、という運用を行っています。これをScheduled Jobで自動化します。

*   **Name**: `Auto-close Resolved Incidents`
*   **Run**: `Daily`
*   **Time**: `02:00:00` (深夜2時など)
*   **Run this script**:
    ```javascript
    (function autoCloseIncidents() {
        var grIncident = new GlideRecord('incident');

        // 条件: 状態が'Resolved' AND 最終更新日から30日以上経過
        grIncident.addQuery('state', 6); // 6は 'Resolved' の値
        grIncident.addEncodedQuery('sys_updated_on<javascript:gs.daysAgo(30)');

        grIncident.query();

        gs.log('Auto-closing ' + grIncident.getRowCount() + ' incidents.', 'AutoCloseJob');

        while (grIncident.next()) {
            grIncident.setValue('state', 7); // 7は 'Closed'
            grIncident.setValue('close_notes', '30日以上更新がなかったため、システムにより自動クローズされました。');
            grIncident.setValue('close_code', 'Closed/Resolved by Caller'); // 適切なクローズコードを設定

            // Business Ruleや通知が実行されないように更新する
            // setWorkflow(false) は、この更新によってトリガーされるBusiness Ruleなどを抑制する
            grIncident.setWorkflow(false);
            grIncident.update();
        }
    })();
    ```
    **`grIncident.setWorkflow(false);`** は重要なポイントです。これを付けないと、`update()` のたびに通常のBusiness Ruleや通知が実行されてしまい、意図しない動作や大量の通知メール送信に繋がる可能性があります。バッチ処理で多数のレコードを更新する際は、原則として使用を検討してください。

#### 3.5. Fix Script - 一度きりのデータ修正・移行

**Fix Script** は、**一度だけ実行**することを目的としたサーバーサイドスクリプトです。主に以下のような用途で使われます。

*   本番環境への適用作業の一環として、特定のデータを設定・修正する
*   開発中に作成したテストデータを一括で削除する
*   大規模なデータ移行や、過去データの修正を行う
*   特定の機能リリースに伴う、一度きりの設定変更

Scheduled Jobと違い、定期実行はされません。管理者が手動で`Run Fix Script`ボタンを押して実行します。一度実行したFix Scriptは、再度実行しようとすると警告が表示されます。

**注意:** Fix Scriptはデータベースを直接変更するため、特に本番環境での実行は非常に危険を伴います。実行前には必ず、PDI (Personal Developer Instance) や開発環境で十分にテストし、可能であれば `gr.setLimit(1)` などで影響範囲を限定して試す、`gs.print()` で更新内容をログに出力するだけにとどめる、などの対策を取ってください。

##### 実践的な例: 特定の古いカテゴリ名を新しいカテゴリ名に一括で更新する

組織変更により、「Legacy Support」というインシデントカテゴリが廃止され、「General Support」に統合されることになったとします。過去のインシデントデータもすべて更新する必要があります。

*   **Name**: `Migrate Legacy Support Category`
*   **Application**: `Global`
*   **Script**:
    ```javascript
    (function runFixScript() {
        // 更新対象を特定する
        var oldCategory = 'legacy_support';
        var newCategory = 'general_support';

        var grIncident = new GlideRecord('incident');
        grIncident.addQuery('category', oldCategory);
        // 大量にある可能性があるので、テスト中は件数を絞る
        // grIncident.setLimit(10);
        grIncident.query();

        // 実行前に、対象件数と更新内容をログで確認する
        gs.info('[Fix Script] ' + grIncident.getRowCount() + '件のインシデントのカテゴリを "' + oldCategory + '" から "' + newCategory + '" に更新します。');

        while (grIncident.next()) {
            gs.print('Updating ' + grIncident.getValue('number') + '...');
            grIncident.setValue('category', newCategory);
            // setWorkflow(false) を使い、この更新でBusiness Ruleが走らないようにする
            grIncident.setWorkflow(false);
            // autoSysFields(false) を使うと、sys_updated_on などのシステムフィールドが更新されない
            // データ修正の意図によっては、これも併用する
            grIncident.autoSysFields(false);
            grIncident.update();
        }

        gs.info('[Fix Script] 更新が完了しました。');

    })();
    ```

#### 3.6. Transform Map Script - インポート時のデータ加工

ExcelやCSVファイルからServiceNowにデータを取り込む（インポートする）際、**Transform Map** を使用します。Transform Mapは、ソースファイル（Excelの列）とターゲットテーブル（ServiceNowのフィールド）の対応付け（マッピング）を定義するものです。

しかし、単純な1対1のマッピングだけでは対応できない複雑なケースがあります。

*   インポートデータ内のユーザー名を元に、ServiceNowの`sys_user`テーブルを検索して、担当者フィールド（参照フィールド）に正しい`sys_id`を設定したい。
*   ソースデータの日付形式が `MM/DD/YYYY` なので、ServiceNowの `YYYY-MM-DD` 形式に変換したい。
*   特定の条件に一致する行はインポートをスキップしたい。

このようなデータ加工やロジックをインポート処理に組み込むために使うのが、**Transform Map Script** です。

##### スクリプトの種類と実行タイミング

Transform Mapでは、様々なタイミングで実行されるスクリプトを定義できます。

*   **`onStart`**: インポート処理全体の開始時に一度だけ実行されます。初期設定やログのヘッダー出力などに使います。
*   **`onBefore`**: ソースファイルの**各行**がターゲットレコードに変換・保存される**前**に実行されます。`source`オブジェクト（ソース行のデータ）を使って、`target`オブジェクト（これから作られるレコード）の値を設定したり、`ignore = true;` とすることでその行のインポートをスキップしたりできます。**最もよく使われるスクリプトです。**
*   **`onAfter`**: 各行がターゲットレコードに保存された**後**に実行されます。保存されたレコードの情報を使って、関連レコードを作成するなどの処理に使います。
*   **`onComplete`**: インポート処理全体の完了時に一度だけ実行されます。結果のサマリーをログに出力したり、完了通知を送信したりするのに使います。

##### `source`, `target`, `log`, `action` オブジェクト

Transform Map Scriptの中では、特殊なオブジェクトが利用できます。

*   **`source`**: ソースファイル（Excelなど）の現在の行を表すオブジェクト。`source.u_user_name` のようにして、列ヘッダー名を指定して値を取得できます。
*   **`target`**: 変換先のテーブルのレコードを表す`GlideRecord`オブジェクト。`target.setValue('assigned_to', ...)` のように値を設定します。
*   **`log`**: インポートログにメッセージを出力します。`log.info('メッセージ')` のように使います。
*   **`action`**: インポートのアクション（`insert`または`update`）を文字列で保持します。

##### 実践的な例: ユーザー名を元に`sys_id`を検索して設定する

Excelファイルに `incident_number` と `assigned_user_name` という列があり、`assigned_user_name` に書かれたユーザー名を元に、インシデントの `assigned_to` フィールドを設定します。

**Transform Map Script (onBefore)**
```javascript
(function runTransformScript(source, map, log, target /*undefined onStart*/) {

    // ソースファイルからユーザー名を取得
    var userName = source.u_assigned_user_name;

    if (userName) {
        // ユーザー名でsys_userテーブルを検索
        var grUser = new GlideRecord('sys_user');
        grUser.addQuery('user_name', userName);
        grUser.query();

        if (grUser.next()) {
            // ユーザーが見つかった場合、そのsys_idをtargetのassigned_toフィールドに設定
            target.assigned_to = grUser.sys_id;
        } else {
            // ユーザーが見つからなかった場合、ログを残してこのマッピングをスキップ
            log.warn('ユーザー "' + userName + '" が見つからなかったため、担当者を設定できませんでした。 (ソース行: ' + source.sys_import_row + ')');
        }
    }

    // 特定の条件でインポートをスキップする例
    if (source.u_state == 'ignore') {
        ignore = true; // 'ignore'というグローバル変数にtrueを設定すると、この行は処理されない
    }

})(source, map, log, target);
```
このスクリプトにより、人間が分かりやすいユーザー名でデータを用意するだけで、ServiceNow側で自動的に正しい参照関係（`sys_id`によるリンク）を構築することができます。

---

### 第4章: 高度なトピックとベストプラクティス

基本的なAPIとスクリプトの種類を理解したら、次はより高品質で、安全かつ効率的な開発を行うための高度なトピックとベストプラクティスを学びましょう。

#### 4.1. Scoped Application vs Global Application

前述の通り、現在のServiceNow開発では、アプリケーションや機能改修を**Scoped Application (スコープアプリケーション)** 内で行うことが強く推奨されています。

##### スコープアプリケーションのメリット

*   **保護された名前空間**: スコープアプリ内で作成したテーブル（例: `x_myapp_task`）やScript Include（例: `x_myapp.MyUtil`）には、固有のプレフィックスが付きます。これにより、他のアプリケーションや将来のServiceNowアップグレードで提供される機能と名前が衝突するのを防ぎます。
*   **依存関係の管理**: アプリケーションが必要とする他のアプリケーションやコンポーネントを明示的に定義できます。
*   **堅牢なセキュリティ**: デフォルトでは、スコープアプリ内のリソース（テーブル、スクリプト等）には、そのアプリ内からしかアクセスできません。外部からのアクセスは、明示的に許可を与える必要があります。これにより、意図しない変更からアプリケーションを保護できます。
*   **配布と管理の容易さ**: アプリケーションをUpdate SetやApp Repoを通じて、他のインスタンス（開発→検証→本番）に簡単に配布・インストールできます。

Globalスコープは、インスタンス全体に影響を与える設定や、非常に汎用的なライブラリなど、限定的な用途でのみ使用すべきです。新規の業務アプリケーションを開発する場合は、必ずScoped Applicationを作成しましょう。

##### スコープ間のAPI呼び出し

スコープアプリAから、スコープアプリBやGlobalスコープのScript Includeを呼び出したい場合があります。

**`global.` プレフィックス**
Scoped AppからGlobalスコープのScript Includeを呼び出すには、`global.`というプレフィックスを付ける必要があります。

```javascript
// Scoped App内のスクリプトから、Globalの 'MyGlobalUtil' を呼び出す
var util = new global.MyGlobalUtil();
var result = util.someFunction();
```

**スコーププレフィックス**
Scoped App 'A' (`x_appa`) から、Scoped App 'B' (`x_appb`) のScript Include `AppBUtil` を呼び出すには、`B`のスコープ名をプレフィックスとして付けます。

```javascript
// スコープ 'x_appa' のスクリプトから、スコープ 'x_appb' の 'AppBUtil' を呼び出す
var utilB = new x_appb.AppBUtil();
var result = utilB.someOtherFunction();
```

ただし、この呼び出しが成功するためには、呼び出される側（AppB）が、呼び出す側（AppA）からのアクセスを許可している必要があります。これは **Application Cross-Scope Access** (`sys_scope_privilege`) レコードで管理されます。アクセスが許可されていない場合、スクリプトはセキュリティエラーで失敗します。

#### 4.2. サーバーサイドデバッグテクニック

`gs.log()` や `gs.info()` は手軽ですが、複雑なロジックのデバッグには限界があります。より強力なデバッグツールとして **Script Debugger** が用意されています。

##### Script Debuggerの使い方

Script Debuggerを使うと、Business RuleやScript Includeなどのサーバーサイドスクリプトの実行を一時停止させ、一行ずつ実行（ステップ実行）したり、その時点での変数の値を確認したりできます。

1.  **デバッガの起動**: ナビゲーションメニューで `System Diagnostics > Script Debugger` を検索して開きます。新しいブラウザウィンドウまたはタブでデバッガが起動します。
2.  **セッションの開始**: Script Debuggerのウィンドウが開いたら、デバッグしたい処理を元のServiceNowウィンドウで実行します（例: インシデントを保存する）。すると、デバッガがそのセッションを捕捉します。
3.  **ブレークポイントの設定**: デバッガの画面左側に、実行されたスクリプトのリストが表示されます。デバッグしたいスクリプト（例: 特定のBusiness Rule）を選択し、コード内の止めたい行の行番号の隣をクリックして**ブレークポイント**（赤い丸）を設定します。
4.  **処理の再実行**: 再度、元のServiceNowウィンドウでデバッグしたい処理を実行します。
5.  **実行の停止**: スクリプトの実行が、設定したブレークポイントの行で一時停止します。
6.  **デバッグ操作**:
    *   **ステップオーバー**: 現在の行を実行し、次の行で停止します。関数呼び出しがある場合、関数の中には入りません。
    *   **ステップイン**: 現在の行が関数呼び出しの場合、その関数の中に入って、その先頭で停止します。
    *   **ステップアウト**: 現在いる関数を最後まで実行し、呼び出し元の次の行に戻ります。
    *   **再開**: 次のブレークポイントまで実行を続けます。
    *   **変数の確認**: 右側のペインで、`current` や `previous` オブジェクトの中身、ローカル変数などの値をリアルタイムで確認できます。

Script Debuggerは、ループ処理の中での変数の変化や、複雑な条件分岐の流れを追跡するのに非常に強力です。使い方をマスターすれば、デバッグ効率が飛躍的に向上します。

#### 4.3. パフォーマンスに関する考慮事項

非効率なスクリプトは、システムの応答性を低下させ、ユーザー体験を損なう原因となります。パフォーマンスを意識したスクリプトを書くことは、プロの開発者として非常に重要です。

*   **`GlideRecord`のループ内で`update()`を呼ばない**:
    これは**最も避けるべきアンチパターン**です。ループ内で`update()`を呼び出すと、レコード1件ごとにデータベースへの書き込みが発生し、非常に遅くなります。

    ```javascript
    // アンチパターン: ループ内でのupdate()
    var gr = new GlideRecord('incident');
    gr.addQuery('active', true);
    gr.query();
    while (gr.next()) {
        gr.setValue('work_notes', '一括更新');
        gr.update(); // ← これが非常に遅い原因
    }

    // 改善策: updateMultiple() を使う (Quebec以降)
    var gr = new GlideRecord('incident');
    gr.addQuery('active', true);
    gr.query();
    gr.setValue('work_notes', '一括更新');
    gr.updateMultiple(); // 1回の命令で全件更新。非常に高速。
    ```
    `updateMultiple()` が使えない古いバージョンでは、Fix ScriptやScheduled Jobで実行するなど、ユーザー操作と切り離す工夫が必要です。

*   **Business Ruleの条件を適切に設定する**:
    Business Ruleの `Filter Conditions` をできるだけ厳しく設定し、不要なスクリプトの実行を避けましょう。例えば、特定のカテゴリのインシデントにしか関係ないロジックなのに、フィルタをかけずに全インシデントの更新でスクリプトが実行されるのは無駄です。

*   **`GlideAggregate`を積極的に利用する**:
    件数や合計値の計算には、`GlideRecord`で全件取得するのではなく、必ず`GlideAggregate`を使いましょう。パフォーマンスが桁違いに向上します。

*   **非同期(Async) Business Ruleの活用**:
    ユーザーの操作を直接待たせる必要のない重い処理（外部API連携、複雑な関連レコードの更新など）は、`async` Business Ruleを使い、バックグラウンドで実行させましょう。これにより、ユーザーはすぐに次の操作に進むことができます。

*   **クエリの最適化**:
    インデックスが設定されているフィールドで検索する、`addEncodedQuery` を活用して効率的なクエリを書くなど、データベースへの問い合わせ自体を高速化する意識も重要です。

#### 4.4. セキュリティに関する考慮事項

スクリプトは強力な分、セキュリティホールを生み出す危険性もはらんでいます。

*   **アクセス制御(ACL)の重要性**:
    ServiceNowのセキュリティの基本は**ACL (Access Control List)** です。スクリプトを書く前に、まずACLで要件が実現できないかを検討してください。スクリプトはACLを迂回するものではなく、ACLによるセキュリティ基盤の上で動作するべきです。
    `gr.setWorkflow(false)` などはACLをバイパスするわけではありませんが、権限昇格などに繋がらないよう、その影響をよく理解して使う必要があります。

*   **`setWorkflow(false)` と `autoSysFields(false)` の理解**:
    *   **`setWorkflow(false)`**: この`GlideRecord`オブジェクトに対する更新/挿入/削除操作において、Business Rule、Script Engine、Auditを**実行しない**ようにします。バッチ更新で意図しない連鎖反応を防ぐのに使いますが、本来実行されるべきロジックまで止めてしまう危険性もあるため、影響範囲を十分に理解して使いましょう。
    *   **`autoSysFields(false)`**: `sys_updated_on`, `sys_updated_by`, `sys_mod_count` といったシステムフィールドの自動更新を停止します。データ移行などで、元の更新日時を保持したい場合などに使います。

*   **Client Callable Script Includeの権限制御**:
    `Client callable` に設定したScript Includeは、ブラウザから誰でも呼び出せるエンドポイントになります。重要なデータを扱ったり、レコードを更新したりするメソッドを実装する場合は、スクリプト内で `gs.hasRole()` などを使って、実行ユーザーが適切な権限を持っているかを必ずチェックしてください。

#### 4.5. REST API連携 (Outbound)

ServiceNowから外部のシステムに対して、REST APIを呼び出す（データを送信したり、取得したりする）こともサーバーサイドスクリプトの重要な役割です。これには **`RESTMessageV2`** APIを利用します。

##### 基本的な使い方 (GET, POST)

1.  **REST Messageレコードの作成**: `System Web Services > Outbound > REST Message` で、接続先のAPIの情報を定義します。エンドポイントURLや認証情報などを設定しておくと、スクリプトから簡単に呼び出せます。
2.  **スクリプトからの呼び出し**:

```javascript
// 例: インシデントが作成されたら、外部のチャットツールに通知を送信する
// (after insert Business Rule on 'incident' table)

(function executeRule(current, previous /*null when async*/) {

    try {
        // 'My Chat Tool' は事前に作成したREST Messageレコードの名前
        // 'post_message' はその中のHTTP Methodレコードの名前
        var r = new sn_ws.RESTMessageV2('My Chat Tool', 'post_message');

        // 動的な値を設定
        var incidentLink = gs.getProperty('glide.servlet.uri') + current.getLink(true);
        var message = '新規インシデント ' + current.getValue('number') + ' が作成されました。\n件名: ' + current.getValue('short_description') + '\nリンク: ' + incidentLink;

        // POSTするJSONボディを作成
        var body = {
            "text": message
        };
        r.setRequestBody(JSON.stringify(body));

        // RESTメッセージを非同期で実行
        // ユーザーの操作をブロックしないように、非同期実行が推奨される
        var response = r.executeAsync();
        // 同期的に実行し、すぐに応答を待つ場合は r.execute() を使う

        // 必要であれば、後で応答を処理するためのコードを記述
        // response.waitForResponse(60); // 60秒待つなど
        // var httpStatus = response.getStatusCode();
        // gs.info('Chat tool API response status: ' + httpStatus);

    } catch (ex) {
        gs.error('Chat tool連携でエラーが発生しました: ' + ex.getMessage());
    }

})(current, previous);
```

`RESTMessageV2` APIを使えば、HTTPヘッダーの設定、クエリパラメータの追加、様々な認証方式（Basic Auth, OAuth 2.0）への対応も可能です。ServiceNowをハブとして、様々なクラウドサービスと連携させる強力な機能です。

---

### 第5章: まとめ

ここまで、ServiceNowのサーバーサイドJavaScriptについて、基本的なAPIから主要なスクリプトの種類、そして高度なトピックまでを網羅的に解説してきました。

#### 学習の進め方

膨大な情報量でしたが、一度にすべてを記憶する必要はありません。以下のステップで学習を進めることをお勧めします。

1.  **PDI (Personal Developer Instance) を使い倒す**:
    ServiceNow Developer Portalから無料で取得できる個人用の開発環境(PDI)で、本ガイドのコード例を実際に**自分の手で入力し、実行**してみてください。エラーが出たら、`gs.info` を使ってデバッグする。この試行錯誤のプロセスが最も重要です。

2.  **`GlideRecord` と `GlideSystem (gs)` をマスターする**:
    まずはこの2つのAPIに慣れることに集中しましょう。インシデントテーブルを対象に、様々な条件でレコードを検索し、ログに出力する練習を繰り返してください。

3.  **Business Rule を作ってみる**:
    次に、簡単な `before` ルールや `after` ルールを作成してみましょう。「優先度が1になったら、作業メモに『最優先になりました』と自動で追記する」など、シンプルなロジックから始めるのが良いでしょう。

4.  **Script Include で共通化を体験する**:
    同じような処理を2つのBusiness Ruleに書いたら、それをScript Includeにまとめて呼び出すようにリファクタリング（書き直し）してみてください。コードがすっきりし、管理しやすくなることを実感できるはずです。

5.  **公式ドキュメントを活用する**:
    本ガイドは全体像を掴むためのものですが、各APIのより詳細なメソッドやオプションについては、**ServiceNow Developer Portal** のAPIリファレンスが最も正確で信頼できる情報源です。何かを実現したいと思ったとき、「Developer Portalで `[API名] API` と検索する」という習慣をつけましょう。

サーバーサイドスクリプトは、ServiceNowの真の力を引き出すための鍵です。最初は難しく感じるかもしれませんが、一つ一つの要素は決して複雑ではありません。PDIで実際に手を動かしながら、少しずつ知識と経験を積み重ねていけば、必ず強力な武器になります。このガイドが、あなたのServiceNow開発者としての旅の一助となれば幸いです。
