### はじめに：ServiceNowにおけるサーバーサイドJavaScriptの役割

ServiceNowプラットフォームの強力なカスタマイズ性を支えているのが、サーバーサイドJavaScriptです。クライアントサイド（ブラウザ側）のスクリプトがフォームの見た目やユーザーの操作に応じた即時的な反応を担うのに対し、サーバーサイドスクリプトは**データベースとの直接的なやり取り、ビジネスロジックの実行、外部システムとの連携**など、ServiceNowの根幹に関わる処理を担当します。

ServiceNowのサーバーサイドJavaScriptをマスターすることは、単なるフォームのカスタマイズを超え、業務プロセスそのものを自動化し、最適化する能力を身につけることを意味します。

#### なぜサーバーサイドスクリプトが必要なのか？

*   **データの一貫性とセキュリティの確保:** ビジネスルールやアクセス制御は、ユーザーのブラウザ環境に依存しないサーバーサイドで強制されるべきです。サーバーサイドスクリプトによって、誰が、いつ、どのようなデータを変更できるかを厳密に管理できます。
*   **複雑なビジネスロジックの実行:** 複数のテーブルを横断するデータの集計、条件に応じた動的なタスク生成、承認プロセスの自動化など、複雑な処理はサーバーサイドで実行する必要があります。
*   **パフォーマンス:** 大量のデータを処理する場合、必要なデータだけをサーバーサイドで抽出・加工してクライアントに返すことで、ブラウザの負荷を軽減し、全体のパフォーマンスを向上させることができます。
*   **自動化と連携:** ユーザーの操作を介さずに、スケジュールされたジョブを実行したり、メール受信をトリガーにインシデントを起票したり、外部のREST APIと連携したりといった処理は、サーバーサイドスクリプトの独壇場です。

#### ServiceNow JavaScriptの技術的背景

ServiceNowのサーバーサイドJavaScriptは、Mozillaが開発したオープンソースのJavaScriptエンジンである **Rhino** をベースにしています。これはECMAScript 5 (ES5) に準拠しています。そのため、近年のJavaScript (ES6/ES2015以降)で導入された `let`, `const`, アロー関数 `=>`, `class` 構文などは、**基本的に使用できない**という点を強く認識しておく必要があります。変数宣言は `var` を使い、関数は `function` キーワードで定義するのが基本となります。

このドキュメントでは、ServiceNowのサーバーサイドで利用できる主要なAPIとスクリプトタイプを網羅的に、そして実践的なコード例を交えながら、最大限わかりやすく解説していきます。

---

### ServiceNowサーバーサイドJavaScriptの基本

ServiceNowのサーバーサイドスクリプティングは、いくつかの強力な組み込みAPI（クラス）を中心に構築されています。これらを理解することが、ServiceNow開発の第一歩です。ここでは最も重要で頻繁に使用されるAPIを解説します。

#### 1. GlideRecord：データベース操作の要

`GlideRecord` は、ServiceNowにおける**データベース操作のすべてを担う、最も重要なサーバーサイドAPI**です。テーブルに対するレコードの検索（Query）、作成（Insert）、更新（Update）、削除（Delete）といった、いわゆるCRUD操作はすべて `GlideRecord` を通じて行います。SQLを直接書く代わりに、オブジェクト指向のメソッドを使ってデータベースと対話します。

##### 1.1. 基本的な使い方：検索 (Query)

最も一般的な使われ方は、特定のテーブルから条件に合うレコードを検索することです。

**ステップ1: インスタンス化**
まず、操作したいテーブル名を引数にして `GlideRecord` のインスタンスを作成します。

```javascript
// incident テーブルを操作するための GlideRecord インスタンスを作成
var grIncident = new GlideRecord('incident'); 
```

**ステップ2: フィルタリング（条件設定）**
次に、どのようなレコードを検索したいかの条件を追加します。`addQuery()` メソッドが最も基本です。

```javascript
// 優先度(priority)が「1 - Critical」のレコードを検索
grIncident.addQuery('priority', 1);

// カテゴリ(category)が「software」のレコードを検索
grIncident.addQuery('category', 'software');

// 複数の addQuery は AND 条件として扱われます。
// つまり、「優先度が1」かつ「カテゴリがsoftware」のインシデントを検索します。
```

**ステップ3: クエリの実行**
設定した条件でデータベースに問い合わせを実行します。

```javascript
grIncident.query(); // データベースへのクエリを実行
```

**ステップ4: 結果の処理（ループ）**
`query()` が実行されると、条件に一致したレコードのリストが `grIncident` オブジェクト内に保持されます。`next()` メソッドを使って、一件ずつレコードを取り出しながら処理を行います。`while` ループと組み合わせるのが定石です。

```javascript
// while ループで、条件に一致したすべてのレコードを順番に処理
while (grIncident.next()) {
  // next() が呼ばれるたびに、grIncident は次のレコードを指します。
  // フィールドの値は、ドット(.)でつなげて取得できます。
  var number = grIncident.number; // インシデント番号
  var shortDescription = grIncident.short_description; // 件名
  
  // 取得した値を使って何か処理を行う (ここではログに出力)
  gs.info('インシデント番号: ' + number + ', 件名: ' + shortDescription);
}
```

**`get()` メソッド：単一レコードの取得**
条件に一致するレコードが**必ず1件であるとわかっている場合**や、特定の1件だけを取得したい場合は `get()` メソッドが便利です。`get()` は `true` または `false` を返します。

```javascript
var grIncident = new GlideRecord('incident');

// Sys ID (各レコードの一意なID) を使って特定の1件を取得
var incidentSysId = 'a83820b58f723300e7e16c7827bdeed2'; // 例
if (grIncident.get(incidentSysId)) {
  // レコードが見つかった場合の処理
  gs.info('指定されたSys IDのインシデントが見つかりました: ' + grIncident.number);
} else {
  // レコードが見つからなかった場合の処理
  gs.info('指定されたSys IDのインシデントは見つかりませんでした。');
}

// get() はフィールドと値のペアでも使えます。
var grProblem = new GlideRecord('problem');
if (grProblem.get('number', 'PRB0040001')) {
  gs.info('問題番号 PRB0040001 のレコードを取得しました。');
}
```

**注意:** `get()` は最初に一致した1件しか返しません。複数のレコードがヒットする可能性がある条件で `get()` を使うと、意図しないレコードを取得する可能性があるため、条件は慎重に設定する必要があります。

##### 1.2. 様々なクエリ条件

`addQuery()` 以外にも、より複雑な条件を指定するためのメソッドがあります。

*   **`addEncodedQuery(string)`**: SQLのWHERE句のように、複数の条件を文字列で一括指定できます。リストビューのフィルタをコピーしてそのまま使えるため、非常に便利です。
    *   `^` は AND 条件、`^OR` は OR 条件を意味します。
    *   例: `priority=1^category=software` (優先度1 AND カテゴリがソフトウェア)
    *   例: `active=true^stateIN3,4^ORcaller_id=javascript:gs.getUserID()` (有効で、かつ、ステータスが3か4、または、起票者が現在のユーザー)

    ```javascript
    var grIncident = new GlideRecord('incident');
    var encodedQuery = 'priority=1^stateIN1,2^short_descriptionLIKEerror';
    // 優先度が1、かつ、ステータスが「新規」または「進行中」、かつ、件名に「error」を含む
    grIncident.addEncodedQuery(encodedQuery);
    grIncident.query();
    while (grIncident.next()) {
      gs.info('Encoded Queryの検索結果: ' + grIncident.number);
    }
    ```

*   **`addOrCondition(string, string)`**: OR条件を追加します。

    ```javascript
    var grIncident = new GlideRecord('incident');
    // カテゴリが 'hardware' または 'software' のインシデントを検索
    var orCondition = grIncident.addQuery('category', 'hardware');
    orCondition.addOrCondition('category', 'software');
    grIncident.query();
    // ...
    ```
    ただし、複雑なOR条件は `addEncodedQuery` の方が可読性が高い場合が多いです。

*   **演算子**: `addQuery` の3番目の引数で演算子を指定できます。
    *   `gr.addQuery('sys_created_on', '>', '2023-01-01 00:00:00');` // より大きい
    *   `gr.addQuery('short_description', 'CONTAINS', 'database');` // 含む
    *   `gr.addQuery('state', 'IN', '6,7');` // いずれかに一致（カンマ区切りの文字列）

##### 1.3. レコードの作成 (Insert)

新しいレコードを作成するには、`initialize()` または `newRecord()` を使って空のレコードオブジェクトを準備し、各フィールドに値を設定してから `insert()` を呼び出します。

```javascript
// 新しいインシデントレコードを作成する例
var grNewIncident = new GlideRecord('incident');

// 方法1: initialize()
grNewIncident.initialize(); // 新規レコードのためのメモリ領域を確保

// 方法2: newRecord() - initialize() とほぼ同じだが、Sys IDを事前に払い出す
// var newSysId = grNewIncident.newRecord(); 

// フィールドに値を設定
// フィールド名はテーブル定義で確認できます (例: 'incident.list' -> Configure -> Table)
grNewIncident.caller_id = gs.getUserID(); // 起票者は現在のユーザー
grNewIncident.short_description = 'サーバーサイドスクリプトによるテストインシデント';
grNewIncident.category = 'inquiry';
grNewIncident.urgency = 3; // 3 - Low
grNewIncident.priority = 5; // 5 - Planning (通常は緊急度と影響度から自動計算される)

// insert() メソッドでデータベースにレコードを書き込む
// insert() は成功した場合、新しいレコードの Sys ID を返す
var newIncidentSysId = grNewIncident.insert(); 

if (newIncidentSysId) {
  gs.info('新しいインシデントが作成されました。番号: ' + grNewIncident.number);
} else {
  gs.error('インシデントの作成に失敗しました。');
}
```
**`insert()` を呼び出すまで、データベースには何も書き込まれません。**

##### 1.4. レコードの更新 (Update)

既存のレコードを更新するには、まず `get()` や `query()`/`next()` で対象のレコードを特定し、フィールド値を変更してから `update()` を呼び出します。

```javascript
// 特定のインシデントを検索し、内容を更新する例
var grIncidentToUpdate = new GlideRecord('incident');

// 更新対象のレコードを get() で取得
if (grIncidentToUpdate.get('number', 'INC0010088')) {
  // フィールドの値を変更
  grIncidentToUpdate.short_description = grIncidentToUpdate.short_description + ' [更新済み]';
  grIncidentToUpdate.work_notes = 'システムにより自動更新されました。'; // 作業メモに追加

  // update() メソッドで変更をデータベースに保存
  grIncidentToUpdate.update();
  
  gs.info(grIncidentToUpdate.number + ' が更新されました。');
} else {
  gs.warn('INC0010088 が見つかりませんでした。');
}
```
**`update()` を呼び出すまで、データベースのレコードは変更されません。**

##### 1.5. レコードの削除 (Delete)

レコードの削除も更新と同様に、対象を特定してから `deleteRecord()` を呼び出します。

```javascript
// 特定のインシデントを検索し、削除する例
var grIncidentToDelete = new GlideRecord('incident');

if (grIncidentToDelete.get('number', 'INC0010099')) { // 削除対象のインシデント
  // deleteRecord() メソッドでレコードを削除
  // 成功すると true、失敗すると false を返す
  if (grIncidentToDelete.deleteRecord()) {
    gs.info('INC0010099 が削除されました。');
  } else {
    gs.error('INC0010099 の削除に失敗しました。');
  }
}
```
**注意:** **レコードの削除は元に戻せません。** 特にバックグラウンドスクリプトなどで実行する際は、対象のクエリが正しいか十分にテストしてください。

複数のレコードをまとめて削除する場合は `deleteMultiple()` が使えますが、これも非常に強力なため、使用には細心の注意が必要です。

```javascript
var grOldIncidents = new GlideRecord('incident');
// 1年以上前に完了したインシデントを検索
grOldIncidents.addEncodedQuery('state=7^closed_at<javascript:gs.beginningOfLastYear()');
grOldIncidents.query();
gs.info(grOldIncidents.getRowCount() + ' 件の古いインシデントを削除します。');
// grOldIncidents.deleteMultiple(); // 本当に実行する場合はコメントを外す
```

##### 1.6. パフォーマンスと効率化のための重要メソッド

*   **`setWorkflow(false)`**: このメソッドを呼び出すと、その `GlideRecord` 操作（`insert`, `update`, `delete`）において、**関連するビジネスルールやワークフロー、通知などが実行されなくなります**。
    *   **用途:** データ移行や一括更新など、ビジネスロジックを意図的にバイパスして純粋なデータ操作だけを行いたい場合に使います。
    *   **リスク:** 本来動くべきロジックが動かなくなるため、データの不整合を引き起こす可能性があります。例えば、ステータス変更時に動くべき通知が飛ばない、関連タスクが作られない、などの問題が発生します。**使用は慎重に判断してください。**

    ```javascript
    var gr = new GlideRecord('incident');
    gr.get('sys_id', '...');
    gr.setWorkflow(false); // この更新ではビジネスルール等を実行しない
    gr.state = 7;
    gr.update();
    ```

*   **`autoSysFields(false)`**: `sys_updated_on`, `sys_updated_by`, `sys_mod_count` といったシステムフィールドの自動更新を抑制します。
    *   **用途:** `setWorkflow(false)` と同様に、データメンテナンス目的で、更新履歴を残したくない場合に使います。
    *   通常は `setWorkflow(false)` とセットで使われることが多いです。

*   **`setLimit(n)`**: クエリ結果を最大 `n` 件に制限します。大量のデータから数件だけ必要な場合に、パフォーマンスを大幅に向上させます。

    ```javascript
    // 最新のインシデントを5件だけ取得
    var grRecent = new GlideRecord('incident');
    grRecent.orderByDesc('sys_created_on'); // 作成日で降順ソート
    grRecent.setLimit(5); // 結果を5件に制限
    grRecent.query();
    while(grRecent.next()) {
        // ...
    }
    ```

*   **ドットウォーキング (Dot-Walking)**: 参照フィールドを通じて、関連テーブルのフィールド値に直接アクセスする機能です。`.`（ドット）でつなげて記述します。

    ```javascript
    var grIncident = new GlideRecord('incident');
    grIncident.get('number', 'INC0010005');
    
    // インシデントの「起票者(caller_id)」は user テーブルへの参照フィールド
    // ドットウォーキングで、起票者の「メールアドレス(email)」や「部署(department)」にアクセスできる
    var callerEmail = grIncident.caller_id.email;
    var callerDepartment = grIncident.caller_id.department.name; // さらに部署テーブルの名前フィールドにアクセス

    gs.info('起票者のメールアドレス: ' + callerEmail);
    gs.info('起票者の部署名: ' + callerDepartment);
    ```
    ドットウォーキングは非常に便利ですが、**ループ内で多用するとパフォーマンス低下の原因**になります。ループ内で同じ関連レコードの情報を何度も参照する場合、一度その関連レコードを `get()` して変数に格納する方が効率的です。

#### 2. GlideSystem (gs)：グローバル便利屋

`GlideSystem` は、`gs` というグローバル変数を通じてどこからでも呼び出せる、便利なメソッドの集合体です。ユーザー情報、システムプロパティ、日付、ログ出力など、日常的なタスクの多くを `gs` がサポートします。

##### 2.1. よく使われるメソッド

*   **ログ出力:** デバッグに不可欠です。
    *   `gs.info(message)`: 情報レベルのログを出力します。（推奨）
    *   `gs.warn(message)`: 警告レベルのログを出力します。
    *   `gs.error(message)`: エラーレベルのログを出力します。
    *   `gs.log(message, source)`: より詳細なログ。第二引数でログのソース（目印）を指定できます。
    *   `gs.print(message)`: バックグラウンドスクリプトで使うと、実行結果画面に直接メッセージを表示します。

*   **ユーザー情報:**
    *   `gs.getUser()`: 現在のユーザーの `GlideUser` オブジェクトを返します。
    *   `gs.getUserID()`: 現在のユーザーの **Sys ID** を返します。`GlideRecord` の参照フィールドに値を設定する際によく使います。
    *   `gs.getUserName()`: 現在のユーザーの **ユーザーID** (ログイン名) を返します。
    *   `gs.getUserDisplayName()`: 現在のユーザーの表示名を返します。
    *   `gs.hasRole(roleName)`: 現在のユーザーが指定されたロールを持っているか `true`/`false` で返します。セキュリティ制御に役立ちます。

    ```javascript
    if (gs.hasRole('itil')) {
      gs.info('このユーザーはITILロールを持っています。');
    } else {
      gs.warn('このユーザーはITILロールを持っていません。処理を中断します。');
    }
    ```

*   **日付・時刻:**
    *   `gs.now()`: 現在の日時を **ユーザーのタイムゾーン** で `yyyy-MM-dd HH:mm:ss` 形式の**文字列**として返します。
    *   `gs.nowDateTime()`: 現在の日時を **システム（UTC）タイムゾーン** で `yyyy-MM-dd HH:mm:ss` 形式の**文字列**として返します。**サーバーサイドの計算や比較では、タイムゾーンに依存しないこちらを使うのが基本です。**

*   **システムプロパティ:**
    *   `gs.getProperty(propertyName, defaultValue)`: `[sys_properties]` テーブルに定義されたシステムプロパティの値を取得します。ハードコーディングを避け、設定値を一元管理するために必須の機能です。第二引数には、プロパティが見つからなかった場合のデフォルト値を指定できます。

    ```javascript
    // 'my_app.default_assignment_group' という名前のシステムプロパティの値を取得
    var defaultGroup = gs.getProperty('my_app.default_assignment_group', 'Service Desk');
    gs.info('デフォルトのアサイン先グループは: ' + defaultGroup);
    ```

*   **イベント:**
    *   `gs.eventQueue(eventName, glideRecordObject, param1, param2)`: イベントを発生させます。このイベントをトリガーに、通知（Email）やスクリプトアクション（Script Action）を実行できます。
        *   `eventName`: `[sysevent_register]` テーブルに登録したイベント名。
        *   `glideRecordObject`: イベントに関連付けるレコード（通常は `current`）。
        *   `param1`, `param2`: イベントに渡す追加情報（文字列）。

    ```javascript
    // 例: インシデントがエスカレーションされた時にイベントを発生させる
    // この 'incident.escalated' イベントをトリガーに、マネージャーへの通知を飛ばす設定が可能
    gs.eventQueue('incident.escalated', current, current.assigned_to.manager, current.number);
    ```

#### 3. GlideDateTime：日付と時刻の専門家

`gs.nowDateTime()` は便利な文字列を返しますが、日付の加算・減算や、二つの日付の差を計算するなどの高度な操作には不向きです。そのような場合は `GlideDateTime` オブジェクトを使います。

##### 3.1. 基本的な使い方

```javascript
// 1. 現在の日時で GlideDateTime オブジェクトを作成
var gdt = new GlideDateTime(); // UTCで現在日時を保持
gs.info('現在のUTC時刻: ' + gdt.getValue()); // yyyy-MM-dd HH:mm:ss 形式の文字列

// 2. 特定の日時文字列からオブジェクトを作成
var gdtFromString = new GlideDateTime('2023-10-27 10:00:00');

// 3. GlideRecord の日時フィールドからオブジェクトを作成
var grIncident = new GlideRecord('incident');
grIncident.get('...');
var gdtOpenedAt = new GlideDateTime(grIncident.opened_at);
```

##### 3.2. 日付・時刻の操作

`add` や `subtract` メソッドで日付や時刻を操作できます。

```javascript
var gdt = new GlideDateTime(); // 現在日時
gs.info('現在: ' + gdt.getDisplayValue()); // ユーザーのタイムゾーンで表示

// 3日後を計算
gdt.addDaysUTC(3); // UTC基準で3日加算
// gdt.addDaysLocalTime(3); // ユーザーのタイムゾーン基準で3日加算
gs.info('3日後: ' + gdt.getDisplayValue());

// 2時間前を計算
gdt.addSeconds(-7200); // 7200秒(2時間)を減算
gs.info('そこから2時間前: ' + gdt.getDisplayValue());
```

##### 3.3. 日付・時刻の比較

二つの `GlideDateTime` オブジェクトは `compareTo()`, `before()`, `after()` で比較できます。

```javascript
var gdt1 = new GlideDateTime('2023-10-27 10:00:00');
var gdt2 = new GlideDateTime('2023-10-28 10:00:00');

if (gdt1.before(gdt2)) {
  gs.info('gdt1 は gdt2 より前の日時です。');
}

// compareTo は、gdt1 > gdt2 なら 1, gdt1 < gdt2 なら -1, 同じなら 0 を返す
gs.info(gdt2.compareTo(gdt1)); // 結果は 1
```

##### 3.4. 実践例：解決目標日時の設定

インシデントが作成されたら、解決目標（`due_date`）を3営業日後に設定するビジネスルール。

```javascript
// (ビジネスルール内で)
// 営業日を考慮するには GlideSchedule を使うのが一般的だが、ここでは GlideDateTime のみで簡易的に実装
var dueDate = new GlideDateTime(current.opened_at);
dueDate.addDaysUTC(3); // ここでは単純に3日後とする

// 土日の場合は月曜日に調整
// getDayOfWeekUTC() : 1=月曜, ..., 7=日曜
if (dueDate.getDayOfWeekUTC() == 6) { // 土曜日なら
  dueDate.addDaysUTC(2); // 2日足して月曜に
} else if (dueDate.getDayOfWeekUTC() == 7) { // 日曜日なら
  dueDate.addDaysUTC(1); // 1日足して月曜に
}

current.due_date = dueDate;
```

#### 4. GlideAggregate：集計処理の達人

`GlideRecord` が一件ずつレコードを処理するのに対し、`GlideAggregate` は**データベース上で直接、集計処理を行う**ためのAPIです。件数のカウント、合計値、平均値などを求める際に、`GlideRecord` で全件ループするよりも**圧倒的に高速**です。

##### 4.1. 基本的な使い方：件数のカウント

カテゴリごとの有効なインシデント件数を集計する例。

```javascript
var gaIncident = new GlideAggregate('incident');

// 条件設定は GlideRecord と同じ
gaIncident.addQuery('active', true);

// 集計方法の指定
gaIncident.addAggregate('COUNT', 'category'); // category フィールドで COUNT (件数) を集計
// もしカテゴリごとではなく、全体の件数だけ知りたい場合は
// gaIncident.addAggregate('COUNT'); 

gaIncident.query(); // 集計クエリを実行

while (gaIncident.next()) {
  var category = gaIncident.category.getDisplayValue(); // 集計対象のフィールド値
  var count = gaIncident.getAggregate('COUNT', 'category'); // 集計結果の取得
  
  gs.info('カテゴリ: ' + category + ' - 件数: ' + count);
}
```
**`groupBy()`** を使って、集計のグルーピングキーを指定することもできます。`addAggregate('COUNT', 'category')` は内部的に `groupBy('category')` を呼び出すのと似ています。

```javascript
var gaIncident = new GlideAggregate('incident');
gaIncident.addQuery('active', true);
gaIncident.groupBy('category'); // カテゴリでグループ化
gaIncident.groupBy('priority'); // さらに優先度でグループ化（複合キー）
gaIncident.addAggregate('COUNT'); // グループごとの件数をカウント
gaIncident.query();

while(gaIncident.next()) {
  var category = gaIncident.category.getDisplayValue();
  var priority = gaIncident.priority.getDisplayValue();
  var count = gaIncident.getAggregate('COUNT');
  gs.info(category + ' | ' + priority + ' | ' + count);
}
```

##### 4.2. その他の集計関数

`COUNT` 以外にも `SUM`, `AVG`, `MIN`, `MAX` が使えます。

```javascript
// 問題(problem)テーブルに関連するインシデントの再アサイン回数(reassignment_count)の合計と平均を計算
var gaIncident = new GlideAggregate('incident');
gaIncident.addQuery('problem_id', 'SYS_ID_OF_THE_PROBLEM'); // 特定の問題に紐づくインシデント
gaIncident.addAggregate('SUM', 'reassignment_count');
gaIncident.addAggregate('AVG', 'reassignment_count');
gaIncident.query();

if (gaIncident.next()) {
  var totalReassignments = gaIncident.getAggregate('SUM', 'reassignment_count');
  var avgReassignments = gaIncident.getAggregate('AVG', 'reassignment_count');
  
  gs.info('再アサイン合計回数: ' + totalReassignments);
  gs.info('再アサイン平均回数: ' + avgReassignments);
}
```

#### 5. current と previous オブジェクト

これらはAPIクラスではありませんが、特に**ビジネスルール**において極めて重要な役割を果たすグローバルオブジェクトです。

*   **`current`**: 現在のデータベース操作（Insert, Update, Delete, Query）の対象となっているレコードを表す `GlideRecord` オブジェクトです。スクリプト内から `current.short_description` や `current.state` のように、フィールドに直接アクセスできます。
*   **`previous`**: **Update** または **Delete** のビジネスルールでのみ利用可能です。データベース上で**変更が保存される前のレコードの状態**を保持しています。

この二つを比較することで、「どのフィールドが」「何から何へ」変更されたのかを検知できます。

```javascript
// (Update のビジネスルール内で)

// 担当者が変更されたかどうかをチェック
if (current.assigned_to.changes()) {
  gs.info('担当者が ' + previous.assigned_to.getDisplayValue() + ' から ' + current.assigned_to.getDisplayValue() + ' に変更されました。');
}

// 優先度が上がったかどうかをチェック
// 優先度は値が小さい方が高い (1:Critical, 5:Planning)
if (current.priority < previous.priority) {
  gs.info('優先度が上がりました！');
  // ここでエスカレーションのイベントを発生させるなどの処理を行う
  gs.eventQueue('incident.priority.increased', current, current.priority, previous.priority);
}

// 状態が「解決済み」に変更された場合
if (current.state.changesTo(6)) { // 6 は Resolved の値
    // ... 解決時の処理 ...
}
```
`current` と `previous` の活用は、効果的なビジネスルールを作成する上で必須のテクニックです。

---

### 主要なサーバーサイドスクリプトの種類と実践

ServiceNowでは、目的や実行タイミングに応じて、様々な場所にサーバーサイドスクリプトを記述します。ここでは主要なものを解説します。

#### 1. ビジネスルール (Business Rules)

ビジネスルールは、**レコードがデータベースで作成、表示、更新、削除される際に、サーバーサイドでスクリプトを自動実行するための仕組み**です。ServiceNowの自動化ロジックの心臓部と言えます。

##### 1.1. When to run (実行タイミング)

ビジネスルールを定義する上で最も重要なのが、この「実行タイミング」の選択です。4つの選択肢があり、それぞれに明確な役割があります。

*   **`Before` (前)**
    *   **タイミング:** ユーザーがフォームを保存（Save/Update）し、その変更が**データベースに書き込まれる直前**に実行されます。
    *   **主な用途:**
        1.  **入力値の検証:** `current` オブジェクトの値をチェックし、条件に合わなければ処理を中断させる（例: 説明フィールドが空なら保存させない）。
        2.  **値の自動計算・変更:** フォームから入力された値に基づいて、他のフィールドの値を自動的に計算・設定する。
    *   **特徴:**
        *   **`current` オブジェクトの値を変更すれば、それがそのままデータベースに保存されます。`current.update()` を呼び出す必要はありません（呼び出してはいけません）。**
        *   処理が非常に高速です。

*   **`After` (後)**
    *   **タイミング:** データベースへの書き込み（Insert/Update/Delete）が**完了した後**に実行されます。
    *   **主な用途:**
        1.  **関連レコードの更新:** `current` レコードの変更に追随して、他のテーブルのレコードを更新する（例: インシデントが解決したら、関連する要求アイテムもクローズする）。
        2.  **イベントの生成:** `gs.eventQueue()` を使って通知などのイベントをトリガーする。
    *   **特徴:**
        *   `current` は読み取り専用と考えるべきです。`current` の値をこのタイミングで変更しても、データベースには反映されません（再度 `current.update()` を呼ぶと、無限ループを引き起こす危険性があります）。
        *   レコードがDBに保存された後なので、`current.sys_id` や `current.number` など、自動採番された値が利用できます。

*   **`Async` (非同期)**
    *   **タイミング:** `After` と同様に、データベースへの書き込みが完了した後に実行されますが、**即時ではなく、スケジューラによって少し遅れてバックグラウンドで実行**されます。
    *   **主な用途:**
        1.  **時間のかかる処理:** 外部システムとのAPI連携など、ユーザーを待たせてしまうような重い処理。
        2.  `GlideAggregate` を使った集計など、現在のレコード操作とは直接関係ないが、トリガーにしたい処理。
    *   **特徴:**
        *   ユーザーはスクリプトの完了を待たずに次の操作に進めるため、体感パフォーマンスが向上します。
        *   `previous` オブジェクトは利用できません。
        *   実行順序が保証されないため、即時性が必要な処理には不向きです。

*   **`Display` (表示)**
    *   **タイミング:** ユーザーがフォームやリストを**表示する直前**に、データがサーバーからブラウザに送信される前に実行されます。
    *   **主な用途:**
        1.  **クライアントスクリプトへの情報提供:** サーバーサイドでしか取得できない情報（例: ログインユーザーの部署、複雑な権限制御の結果）を計算し、`g_scratchpad` という特別なオブジェクトに格納します。クライアントスクリプトは `g_scratchpad` を参照して、フォームの表示を動的に制御できます。
    *   **特徴:**
        *   データベースへの書き込みは行いません。あくまで表示のためのデータ準備が目的です。
        *   `current` は表示対象のレコードを指します。

##### 1.2. 重要なメソッド

*   `current.setAbortAction(true)`: **Before** のビジネスルール内でこのメソッドを呼び出すと、**データベースへの操作（Insert/Update）が中止されます**。入力値検証でエラーがあった場合に、保存を止めるために使います。

##### 1.3. 実践例

*   **実践例1: Before Insert - 入力値検証**
    *   **目的:** 新規インシデント作成時、「説明(description)」フィールドが空の場合は登録を中止し、エラーメッセージを表示する。
    *   **設定:**
        *   Table: `incident`
        *   When to run: `Before`
        *   Insert: `true`
    *   **スクリプト:**
        ```javascript
        (function executeRule(current, previous /*not used*/) {
        
          if (current.description.nil()) { // nil() はフィールドが null か空文字列かをチェックする
            gs.addErrorMessage('「説明」フィールドは必須です。詳細を入力してください。');
            current.setAbortAction(true); // データベースへの保存を中止
          }
        
        })(current, previous);
        ```

*   **実践例2: Before Update - フィールドの自動設定**
    *   **目的:** インシデントの「アサイン先グループ」が変更されたら、「担当者」を空にする。
    *   **設定:**
        *   Table: `incident`
        *   When to run: `Before`
        *   Update: `true`
        *   Filter Conditions: `Assignment group | changes`
    *   **スクリプト:**
        ```javascript
        (function executeRule(current, previous /*not used*/) {
        
          // Filter Conditions で「アサイン先グループが変更された」ことを担保しているので、
          // スクリプト内での if (current.assignment_group.changes()) は不要。
          // Filter Conditions を使うことで、不要なスクリプト実行が減り、パフォーマンスが向上します。
        
          current.assigned_to = ''; // 担当者フィールドを空にする
        
        })(current, previous);
        ```

*   **実践例3: After Update - 関連レコードの更新**
    *   **目的:** インシデントのステータスが「解決済み(Resolved)」になったら、そのインシデントを根本原因とする全ての問題タスク(problem_task)をクローズする。
    *   **設定:**
        *   Table: `incident`
        *   When to run: `After`
        *   Update: `true`
        *   Filter Conditions: `State | changes to | Resolved`
    *   **スクリプト:**
        ```javascript
        (function executeRule(current, previous /*not used*/) {
        
          var grTask = new GlideRecord('problem_task');
          // 'rfc' フィールドがこのインシデントを参照している問題タスクを検索
          // (フィールド名は例。実際は適切な関連フィールドを使う)
          grTask.addQuery('rfc', current.sys_id);
          grTask.addQuery('active', true); // まだオープンなタスクのみ
          grTask.query();
        
          while(grTask.next()) {
            grTask.state = 3; // 3 は Closed
            grTask.work_notes = '根本原因のインシデント ' + current.number + ' が解決されたため、このタスクは自動クローズされました。';
            grTask.update();
          }
        
        })(current, previous);
        ```

*   **実践例4: Display - クライアントへの情報提供**
    *   **目的:** インシデントフォーム表示時、起票者がVIPかどうかを判定し、その結果をクライアントスクリプトで使えるようにする。
    *   **設定:**
        *   Table: `incident`
        *   When to run: `Display`
    *   **スクリプト:**
        ```javascript
        (function executeRule(current, previous /*not used*/) {
        
          // g_scratchpad はクライアントに渡すための空のオブジェクト
          // サーバーでプロパティを設定すると、クライアントで参照できる
          g_scratchpad.isCallerVip = current.caller_id.vip;
        
        })(current, previous);
        ```
    *   **対応するクライアントスクリプト (onLoad):**
        ```javascript
        function onLoad() {
          // Display ビジネスルールで設定された g_scratchpad の値を使用
          if (g_scratchpad.isCallerVip) {
            g_form.addInfoMessage('注意: このインシデントの起票者はVIPです。');
            // フィールドの背景色を変えるなどの装飾も可能
          }
        }
        ```

#### 2. スクリプトインクルード (Script Includes)

スクリプトインクルードは、**再利用可能なサーバーサイドのコードをまとめておくためのライブラリ**です。同じような処理を複数のビジネスルールやUIアクションで書く代わりに、スクリプトインクルードに一つの関数（またはクラスのメソッド）として定義し、各所からそれを呼び出すようにします。

**なぜスクリプトインクルードを使うのか？**
*   **再利用性:** 同じコードを何度も書く必要がなくなります。
*   **保守性:** ロジックの修正が必要になった場合、スクリプトインクルードの一箇所を修正するだけで、それを呼び出しているすべての箇所に反映されます。
*   **可読性:** ビジネスルールなどのスクリプトが簡潔になり、「何をしているか」が分かりやすくなります。複雑な処理はスクリプトインクルードに隠蔽されます。
*   **GlideAjaxによるクライアント連携:** クライアントスクリプトからサーバーサイドのロジックを呼び出す際の受け皿となります（後述）。

##### 2.1. クラスベースのスクリプトインクルード (推奨)

現在主流の書き方です。クラスとしてコードを構造化します。

```javascript
// Script Include Name: UserInfoUtils

var UserInfoUtils = Class.create();
UserInfoUtils.prototype = {
    /**
     * initialize: このクラスのインスタンスが作成される際に実行されるコンストラクタ
     */
    initialize: function() {
    },

    /**
     * 指定されたユーザーのマネージャーのSys IDを取得する
     * @param {string} userSysId ユーザーのSys ID
     * @return {string} マネージャーのSys ID。見つからない場合は null
     */
    getManager: function(userSysId) {
        if (!userSysId) {
            return null;
        }

        var grUser = new GlideRecord('sys_user');
        if (grUser.get(userSysId)) {
            return grUser.getValue('manager');
        }
        
        return null;
    },

    /**
     * 指定されたユーザーが所属する全てのグループのSys IDを配列で返す
     * @param {string} userSysId ユーザーのSys ID
     * @return {Array} グループのSys IDの配列
     */
    getGroups: function(userSysId) {
        var groupIds = [];
        if (!userSysId) {
            return groupIds;
        }

        var grMember = new GlideRecord('sys_user_grmember');
        grMember.addQuery('user', userSysId);
        grMember.query();
        while (grMember.next()) {
            groupIds.push(grMember.getValue('group'));
        }
        
        return groupIds;
    },

    type: 'UserInfoUtils'
};
```

**呼び出し方（例: ビジネスルールから）**

```javascript
// ビジネスルール内
(function executeRule(current, previous) {
    // スクリプトインクルードのインスタンスを作成
    var utils = new UserInfoUtils();
    
    // 起票者のマネージャーを取得
    var managerId = utils.getManager(current.caller_id);
    
    if (managerId) {
        current.u_caller_manager = managerId; // カスタムフィールドにマネージャーを設定
    }

})(current, previous);
```

##### 2.2. Client callable

スクリプトインクルードのフォームには `Client callable` というチェックボックスがあります。これにチェックを入れると、そのスクリプトインクルードは**クライアントスクリプトから `GlideAjax` を通じて呼び出すことが可能**になります。この場合、`AbstractAjaxProcessor` を継承するのが一般的です。（詳細はGlideAjaxのセクションで解説します）

#### 3. バックグラウンドスクリプト (Background Scripts)

**管理者が一時的なデータ操作や、開発中のスクリプトの断片をテストするために使用する**、使い捨てのスクリプト実行環境です。`System Definition > Scripts - Background` または `System Applications > Studio` からアクセスできます。

**特徴と注意点:**
*   **非常に強力:** `GlideRecord` の `update()` や `deleteRecord()` などを実行すると、**対象の全レコードが即座に更新・削除されます。** `setWorkflow(false)` を使わない限り、ビジネスルールもトリガーされます。
*   **本番環境での実行は厳禁:** テストやデータ修正は、必ず開発環境やテスト環境で行い、本番環境へはFix Scriptや更新セット（Update Set）を使って適用します。やむを得ず本番環境で実行する場合は、いきなり更新・削除処理を書くのではなく、まずは `gs.print()` や `gs.info()` で対象件数や内容をログ出力し、**意図したレコードのみが対象になっていることを十分に確認**してから実行してください。
*   **スコープ:** デフォルトでは「Global」スコープで実行されます。スコープアプリケーションのスクリプトをテストする場合は、対象のスコープを選択する必要があります。

**実践例：特定のインシデントを一括でクローズする**

```javascript
// まずは対象を検索して件数を確認する (安全なステップ1)
var grIncident = new GlideRecord('incident');
grIncident.addQuery('category', 'old_category');
grIncident.addQuery('active', true);
grIncident.addEncodedQuery('sys_created_on<javascript:gs.monthsAgo(6)'); // 6ヶ月以上前に作成
grIncident.query();

gs.print('更新対象のインシデント件数: ' + grIncident.getRowCount());

// while ループで対象の番号などを表示し、さらに確認
while (grIncident.next()) {
    gs.print('対象: ' + grIncident.number + ' - ' + grIncident.short_description);
    
    // ここからが更新処理 (安全確認が終わってからコメントを外す)
    /*
    grIncident.state = 7; // Closed
    grIncident.close_code = 'Closed/Resolved by Caller';
    grIncident.close_notes = 'システム管理者により一括クローズされました。';
    grIncident.setWorkflow(false); // 通知や他のBRが動かないようにする
    grIncident.autoSysFields(false); // 更新者情報などを更新しない
    grIncident.update();
    */
}

gs.print('処理が完了しました。');
```

#### 4. フィックススクリプト (Fix Scripts)

フィックススクリプトは、バックグラウンドスクリプトと似ていますが、**アプリケーションのインストールやアップグレードの一環として、一度だけ実行されることを目的としたスクリプト**です。

**バックグラウンドスクリプトとの違い:**
*   **追跡可能:** 実行履歴が残ります。
*   **更新セットに含まれる:** 環境間での移行（開発→テスト→本番）が容易です。
*   **ロールバック可能:** スクリプトにロールバック処理を記述しておけば、適用後に問題が発生した場合に元に戻すことができます。

**用途:**
*   システムプロパティの初期設定
*   新しい選択肢（Choice）の追加に伴う、既存データの移行
*   リリースに伴う一時的なデータ修正

#### 5. ワークフローアクティビティ (Run Script)

グラフィカルなワークフローエディタ内で、特定の処理を実行するために使用します。ワークフローの分岐条件を複雑にしたり、タスクを動的に生成したり、外部システムと連携したりといった、定型的なアクティビティだけでは実現できないロジックを組み込むことができます。

**利用可能なオブジェクト:**
*   `current`: ワークフローが紐づいているレコード。
*   `workflow`: ワークフロー自体を操作するオブジェクト。`workflow.scratchpad` を使って、アクティビティ間で情報を引き継ぐことができます。

**実践例：要求管理ワークフローでのタスク生成**

要求されたアイテム（`sc_req_item`）に応じて、生成するカタログタスク（`sc_task`）の内容を変える。

```javascript
// ワークフローの 'Run Script' アクティビティ内

// カタログタスクを生成
var grTask = new GlideRecord('sc_task');
grTask.initialize();
grTask.request_item = current.sys_id; // 親の要求アイテムを設定

// 要求アイテムの変数 (Variable) の値によってタスクの内容を変える
if (current.variables.pc_type == 'laptop') {
    grTask.assignment_group.setDisplayValue('Hardware Team');
    grTask.short_description = 'ノートPCのセットアップと発送';
} else if (current.variables.pc_type == 'desktop') {
    grTask.assignment_group.setDisplayValue('Desktop Support');
    grTask.short_description = 'デスクトップPCの設置';
} else {
    grTask.short_description = 'PC要求に関する確認タスク';
}

grTask.insert();
```

#### 6. UIアクション (UI Actions)

フォームやリストの上部・下部に**ボタンやリンク、あるいはコンテキストメニュー（右クリックメニュー）を追加**する機能です。ユーザーが能動的に実行するサーバーサイドロジックの入り口となります。

**クライアントとサーバーの連携:**
UIアクションは、クライアントサイド（ブラウザ）で実行するか、サーバーサイドで実行するか、あるいはその両方を組み合わせるかを設定できます。

*   **`Client` チェックボックス:**
    *   **オフ（デフォルト）:** ボタンをクリックすると、フォーム全体がサーバーに送信され、**サーバーサイドスクリプト**が実行されます。処理後、画面はリロードされます。
    *   **オン:** ボタンをクリックすると、**`OnClick` フィールドに記述されたクライアントサイドのJavaScript関数**が実行されます。

*   **一般的なパターン（クライアントとサーバーの連携）:**
    1.  `Client` チェックボックスをオンにする。
    2.  `OnClick` フィールドに関数名（例: `runServerLogic();`）を記述する。
    3.  スクリプトフィールドに、クライアントサイドの関数とサーバーサイドの処理を両方記述する。
    4.  クライアントサイドの関数内で、`g_form.save()` でフォームを保存したり、確認ダイアログを出したりした後、`gsftSubmit()` を使ってサーバーサイドの処理を呼び出す。

**実践例：インシデントをエスカレーションするボタン**

*   **目的:** インシデントフォームに「エスカレーション」ボタンを追加。クリックすると優先度を1段階上げ、作業メモに記録し、マネージャーに通知（イベント発行）する。
*   **設定:**
    *   Name: `エスカレーション`
    *   Table: `incident`
    *   Action name: `escalate_incident`
    *   Show insert: `false`, Show update: `true`
    *   Client: `false` (今回はサーバーサイドのみで完結)
    *   Form button: `true`
*   **Condition (表示条件):**
    ```javascript
    current.priority > 1 && current.active == true
    // 優先度が「1 - Critical」でなく、かつ有効なインシデントの場合にのみボタンを表示
    ```
*   **Script:**
    ```javascript
    // サーバーサイドスクリプト
    // 優先度の値を1減らす (値が小さいほど優先度が高い)
    current.priority = parseInt(current.priority, 10) - 1;
    
    // 作業メモに記録
    current.work_notes = 'インシデントが ' + gs.getUserDisplayName() + ' によってエスカレーションされました。';

    // 変更を保存
    current.update();

    // イベントを発行して通知をトリガー
    gs.eventQueue('incident.escalated', current, current.assignment_group.manager, gs.getUserName());
    
    // ユーザーへのフィードバックメッセージ
    gs.addInfoMessage('インシデント ' + current.number + ' がエスカレーションされました。');

    // 処理後に同じフォームに戻る
    action.setRedirectURL(current);
    ```

---

### クライアントとサーバーの連携：GlideAjax

`GlideAjax` は、**ページ全体をリロードすることなく、クライアントスクリプトからサーバーサイドのスクリプトインクルードを呼び出し、データを受け取る**ための非同期通信技術（AJAX）です。これにより、ユーザーの操作に応じて動的にフォームの内容を変化させる、リッチでインタラクティブなUIを実現できます。

**なぜ `GlideAjax` が重要か？**
`g_form.getReference()` もサーバーから情報を取得できますが、関連レコードの全フィールドを取得するため非効率です。`GlideAjax` であれば、**サーバーサイドで必要な情報だけをピンポイントで計算・抽出し、その結果だけをクライアントに返す**ため、非常に軽量で高速です。

#### 構成要素

`GlideAjax` は、クライアントサイドとサーバーサイドの2つの要素で構成されます。

1.  **クライアントスクリプト (Client Script):**
    *   `GlideAjax` オブジェクトをインスタンス化する。
    *   呼び出したい**スクリプトインクルード名**を指定する。
    *   `addParam()` でサーバーに送るパラメータを設定する。
        *   `sysparm_name`: 呼び出したい**スクリプトインクルード内の関数名**を指定する。**これは必須です。**
        *   その他、任意のカスタムパラメータ（例: `sysparm_user_id`）。
    *   `getXML(callbackFunction)` でサーバーにリクエストを送信する。処理は非同期で行われ、応答が返ってきたらコールバック関数が実行される。
2.  **スクリプトインクルード (Script Include):**
    *   **`Client callable` に必ずチェックを入れる。**
    *   `AbstractAjaxProcessor` を継承したクラスを作成するのが一般的です。
    *   クライアントから `sysparm_name` で指定された名前の関数を定義する。
    *   `this.getParameter('sysparm_user_id')` のようにして、クライアントから送られてきたパラメータを取得する。
    *   処理を実行し、結果を `return` で返す（文字列、JSON文字列など）。

#### 実践的な例：構成アイテムのサポートグループを自動設定

*   **シナリオ:** インシデントフォームで、ユーザーが「構成アイテム(Configuration Item)」フィールドを選択・変更した際に、そのCIの「サポートグループ(Support group)」を自動的に「アサイン先グループ(Assignment group)」フィールドに設定する。

##### ステップ1: スクリプトインクルードの作成

まず、サーバーサイドのロジックを作成します。

*   **Name:** `IncidentAjaxUtils`
*   **API Name:** `global.IncidentAjaxUtils` (Globalスコープの場合)
*   **Client callable:** **`true`** (チェックを入れる)
*   **Script:**
    ```javascript
    var IncidentAjaxUtils = Class.create();
    // AbstractAjaxProcessorを継承することで、GlideAjaxの処理が容易になる
    IncidentAjaxUtils.prototype = Object.extendsObject(AbstractAjaxProcessor, {

        /**
         * 指定された構成アイテムのサポートグループのSys IDを取得する
         */
        getSupportGroup: function() {
            // クライアントから 'sysparm_ci_id' という名前で渡されたパラメータを取得
            var ciSysId = this.getParameter('sysparm_ci_id');

            var grCI = new GlideRecord('cmdb_ci');
            if (grCI.get(ciSysId)) {
                // CIの 'support_group' フィールドの値を返す
                // getValue() を使うと、値が存在しない場合に null が返るため安全
                return grCI.getValue('support_group');
            }
            
            return null; // 見つからなかった場合は null を返す
        },

        type: 'IncidentAjaxUtils'
    });
    ```

##### ステップ2: クライアントスクリプトの作成

次に、このスクリプトインクルードを呼び出すクライアントスクリプトを作成します。

*   **Name:** `Set Assignment Group on CI Change`
*   **Table:** `incident`
*   **UI Type:** `All` (Desktop, Mobile/Service Portal両対応)
*   **Type:** `onChange`
*   **Field name:** `Configuration item` (cmdb_ci)
*   **Script:**
    ```javascript
    function onChange(control, oldValue, newValue, isLoading, isTemplate) {
        // フォームロード時やテンプレート適用時、または値がクリアされた場合は何もしない
        if (isLoading || newValue === '') {
            return;
        }

        // 1. GlideAjax のインスタンスを作成
        // 引数は、呼び出したいスクリプトインクルードの「Name」
        var ga = new GlideAjax('IncidentAjaxUtils');

        // 2. 呼び出したいサーバー側の「関数名」を 'sysparm_name' として指定
        ga.addParam('sysparm_name', 'getSupportGroup');

        // 3. サーバーに渡したい他のパラメータを追加
        // 'sysparm_ci_id' というキーで、変更後の構成アイテムのSys ID (newValue) を渡す
        ga.addParam('sysparm_ci_id', newValue);

        // 4. サーバーに非同期リクエストを送信
        // 応答が返ってきたら、第一引数で指定したコールバック関数 (setAssignmentGroup) が実行される
        ga.getXML(setAssignmentGroup);
    }

    /**
     * GlideAjaxからの応答を処理するコールバック関数
     * @param {object} response - サーバーからのXML応答オブジェクト
     */
    function setAssignmentGroup(response) {
        // 応答XMLから、answer属性の値を取得する
        // スクリプトインクルードの return 値がこの 'answer' に入る
        var answer = response.responseXML.documentElement.getAttribute("answer");
        
        // answer が null や空文字列でなければ、処理を続行
        if (answer) {
            // g_form API を使って「アサイン先グループ」フィールドに値を設定
            // answer にはサポートグループのSys IDが入っている
            g_form.setValue('assignment_group', answer);
        }
    }
    ```

これで、ユーザーが構成アイテムを変更するたびに、ページをリロードすることなく、アサイン先グループが自動的に設定されるようになります。これが `GlideAjax` の強力な機能です。

---

### 高度なトピックとベストプラクティス

基本的なAPIとスクリプトタイプを理解したら、次はより高品質で堅牢な開発を行うための高度なトピックとベストプラクティスを学びましょう。

#### 1. スコープアプリケーション vs. グローバルアプリケーション

ServiceNowの開発は、「グローバル(Global)」スコープか、「スコープアプリケーション(Scoped Application)」のいずれかで行われます。

*   **グローバルスコープ:** 従来の開発スタイル。すべての開発成果物（ビジネスルール、スクリプトインクルードなど）が単一の「グローバル」な名前空間に作成されます。自由度が高い反面、異なる開発者やチームが作成したロジックが意図せず衝突したり、システムのアップグレード時に問題が発生したりするリスクがあります。
*   **スコープアプリケーション:** アプリケーションごとに独立した「名前空間（スコープ）」を提供します。これにより、アプリケーションの成果物が保護され、他のアプリケーションやグローバルスコープのオブジェクトと意図せず干渉することを防ぎます。**現在、新規のカスタムアプリケーション開発では、スコープアプリケーションでの開発が強く推奨されています。**

**スコープアプリケーションでの開発における注意点:**
*   **命名規則:** 作成したテーブルやスクリプトには、自動的にスコーププレフィックス（例: `x_12345_my_app_`）が付与されます。
*   **API呼び出し:** 基本的なAPI (`GlideRecord`, `gs` など) は使えますが、他のスコープで定義されたスクリプトインクルードやテーブルを呼び出すには、**相互のスコープでアクセス許可（Cross-scope privilege）を設定する**必要があります。
*   **gs.getProperty()**: スコープアプリケーション内からシステムプロパティを呼び出す際は、`gs.getProperty('scope.prefix.property.name')` のように、スコープ名を含めた完全な名前で指定する必要があります。

#### 2. パフォーマンスチューニング

スクリプトのパフォーマンスは、ServiceNowインスタンス全体の応答性に直接影響します。特に以下の点に注意してください。

*   **【最重要】ループ内でのクエリを絶対に避ける:**
    *   これはパフォーマンスを低下させる最大の原因です。`while` ループの中で `GlideRecord` の `query()` や `get()` を呼び出すと、レコードの数だけデータベースへの往復が発生し、非常に非効率です。

    **悪い例：**
    ```javascript
    var grIncident = new GlideRecord('incident');
    grIncident.addQuery('active', true);
    grIncident.query();
    while (grIncident.next()) {
        // ループの中で毎回ユーザーテーブルにクエリしている (非常に悪い)
        var grUser = new GlideRecord('sys_user');
        if (grUser.get(grIncident.caller_id)) {
            gs.info(grIncident.number + ' の起票者の部署は ' + grUser.department.getDisplayValue());
        }
    }
    ```

    **良い例（改善策1：IDを収集して一括クエリ）:**
    ```javascript
    var userIds = [];
    var incidentMap = {};

    var grIncident = new GlideRecord('incident');
    grIncident.addQuery('active', true);
    grIncident.query();
    while (grIncident.next()) {
        var userId = grIncident.getValue('caller_id');
        if (userId) {
            userIds.push(userId);
            if (!incidentMap[userId]) {
                incidentMap[userId] = [];
            }
            incidentMap[userId].push(grIncident.getValue('number'));
        }
    }
    
    // 収集したIDでユーザーテーブルに一度だけクエリ
    var grUser = new GlideRecord('sys_user');
    grUser.addQuery('sys_id', 'IN', userIds.join(','));
    grUser.query();
    while(grUser.next()) {
        var userId = grUser.getValue('sys_id');
        var department = grUser.department.getDisplayValue();
        var incidents = incidentMap[userId];

        gs.info(incidents.join(',') + ' の起票者の部署は ' + department);
    }
    ```

*   **`GlideAggregate` を積極的に使う:** レコード件数のカウントや合計値の計算には、`GlideRecord` で全件ループするのではなく、`GlideAggregate` を使ってください。
*   **フィルタ条件を最大限に活用する:** ビジネスルールやUIアクションでは、スクリプト内で `if` 文を使って条件分岐する前に、フォームの「Condition」フィールドや「Filter Conditions」で実行条件をできるだけ絞り込みます。これにより、不要なスクリプトの実行そのものを防ぎ、パフォーマンスを向上させます。
*   **インデックスの利用:** クエリの条件に使うフィールド（特に `addQuery` で指定するフィールド）には、データベースのインデックスが設定されていることが望ましいです。頻繁に検索されるフィールドには、管理者がインデックスを追加することを検討してください。

#### 3. デバッグ手法

開発中に問題の原因を特定するためのデバッグは不可欠なスキルです。

*   **`gs.log()`, `gs.info()` など:** 最も基本的なデバッグ手法。スクリプトの要所要所で変数の中身や処理の通過点をログに出力します。`System Logs > System Log > All` で確認できます。
*   **スクリプトデバッガ (Script Debugger):**
    *   より高度なデバッグツール。スクリプトにブレークポイントを設定し、実行を一時停止させ、その時点での変数の値を確認したり、ステップ実行（一行ずつ実行）したりできます。
    *   `System Diagnostics > Session Debug > Script Debugger` を有効にし、ビジネスルールなどのスクリプトエディタでブレークポイントを設定します。
*   **スクリプトトレーサー (Script Tracer):**
    *   あるトランザクション（例: フォームの保存）において、どのようなサーバーサイドスクリプト（ビジネスルール、アクセス制御など）が、どのような順番で実行されたかを追跡・表示します。
    *   「どのビジネスルールが意図せず動いているのか？」や「なぜこのフィールドの値が変わるのか？」を調査するのに非常に強力です。`System Diagnostics > Session Debug > Script Tracer` から利用できます。

#### 4. セキュリティに関する考慮事項

*   **ACL (Access Control List):** ServiceNowのセキュリティの根幹です。サーバーサイドスクリプトは、**原則としてACLのルールに従って実行されます**。スクリプトの実行ユーザーが読み取り権限を持たないテーブルやフィールドに `GlideRecord` でアクセスしようとしても、データは取得できません。
*   **`GlideRecordSecure`:** もしスクリプトがACLを無視して動作するような高い権限で実行されている場合でも、**意図的にACLを適用させたい**場合は、`GlideRecord` の代わりに `GlideRecordSecure` を使います。これにより、スクリプトの実行ユーザーが持つ権限の範囲内でのみデータ操作が許可されるようになります。
*   **`setWorkflow(false)` のリスク:** 前述の通り、このメソッドはビジネスルールだけでなく、監査（auditing）や他のエンジンの動作もバイパスします。データの整合性や追跡性が損なわれるリスクを十分に理解した上で使用してください。

#### 5. REST API連携 (Outbound)

ServiceNowから外部のWebサービスを呼び出すには、`RESTMessageV2` APIを使用します。

*   **基本的な使い方:** `System Web Services > Outbound > REST Message` で、接続先のエンドポイントや認証情報を事前に定義しておくと、スクリプトからの呼び出しが簡単になります。

**実践例：インシデント作成時にSlackへ通知する**

```javascript
// ビジネスルール (Async) などで実行
try {
    // 1. RESTMessageV2 のインスタンスを作成
    // 'Slack' は事前に定義したREST Messageレコードの名前
    // 'Post Message' はその中のHTTP Methodレコードの名前
    var r = new sn_ws.RESTMessageV2('Slack', 'Post Message');

    // 2. パラメータやリクエストボディを設定
    // REST Message定義側で変数を設定しておくと、ここで値をセットできる
    // r.setStringParameterNoEscape('channel', '#incidents');
    var message = '新規インシデントが作成されました: ' + current.number + ' - ' + current.short_description;
    r.setRequestBody('{"text":"' + message + '"}');

    // 3. 実行
    var response = r.execute();
    var httpStatus = response.getStatusCode();
    
    // 4. 応答を処理
    if (httpStatus == 200) {
        gs.info('Slackへの通知に成功しました。');
    } else {
        gs.error('Slackへの通知に失敗しました。Status: ' + httpStatus + ' Body: ' + response.getBody());
    }

} catch (ex) {
    gs.error('Slack連携中に例外が発生しました: ' + ex.getMessage());
}
```

---

### まとめ

このドキュメントでは、ServiceNowのサーバーサイドJavaScriptについて、その役割から基本的なAPI、主要なスクリプトタイプ、そして高度なトピックまでを網羅的に解説しました。

最後に、学習のポイントを再確認しましょう。

*   **`GlideRecord` がすべての基本:** ServiceNowのデータベースを操作するための最も重要なAPIです。CRUD操作と効率的なクエリの方法をマスターすることが第一歩です。
*   **ビジネスルールとスクリプトインクルードが両輪:** ビジネスルールで「いつ」「何を」するかを定義し、具体的な処理ロジックは再利用可能なスクリプトインクルードに記述するのが、モダンで保守性の高い開発スタイルです。
*   **`GlideAjax` でリッチなUIを実現:** ページをリロードせずにサーバーと通信する `GlideAjax` は、ユーザー体験を向上させるために不可欠な技術です。クライアントスクリプトとスクリプトインクルードの連携を理解しましょう。
*   **常にパフォーマンスとセキュリティを意識する:** ループ内クエリを避け、ACLの存在を念頭に置くなど、品質の高いスクリプトを書くための習慣を身につけることが重要です。

ServiceNowのプラットフォームは非常に奥が深く、常に進化しています。ここでの学習をスタートラインとして、ぜひ公式ドキュメントや下記の資料を活用し、さらなる知識を深めていってください。

*   **ServiceNow Developer Portal:** APIリファレンスやチュートリアルが豊富にあります。
*   **Now Learning:** ServiceNowが提供する公式のe-learningプラットフォームです。
*   **ServiceNow Community:** 世界中の開発者が質問や知識を交換しているフォーラムです。

