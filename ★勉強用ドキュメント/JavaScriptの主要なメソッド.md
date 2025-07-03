

---

### 配列 (Array) のメソッド

配列はデータの集まりを扱うオブジェクトで、その操作には非常に多くの便利なメソッドが用意されています。

#### 要素の追加・削除（元の配列を変更します）

* `push(要素1, ...)`: **配列の末尾に1つ以上の要素を追加**します。戻り値は追加後の配列の長さです。  
    
  const fruits \= \['りんご', 'バナナ'\];  
    
  const newLength \= fruits.push('みかん');  
    
  console.log(fruits);    // 結果: \['りんご', 'バナナ', 'みかん'\]  
    
  console.log(newLength); // 結果: 3  
    
* `pop()`: **配列の末尾の要素を1つ取り除き**、その取り除いた要素を返します。  
    
  const fruits \= \['りんご', 'バナナ', 'みかん'\];  
    
  const removedFruit \= fruits.pop();  
    
  console.log(fruits);       // 結果: \['りんご', 'バナナ'\]  
    
  console.log(removedFruit); // 結果: 'みかん'  
    
* `unshift(要素1, ...)`: **配列の先頭に1つ以上の要素を追加**します。戻り値は追加後の配列の長さです。  
    
  const fruits \= \['りんご', 'バナナ'\];  
    
  fruits.unshift('レモン', 'ぶどう');  
    
  console.log(fruits); // 結果: \['レモン', 'ぶどう', 'りんご', 'バナナ'\]  
    
* `shift()`: **配列の先頭の要素を1つ取り除き**、その取り除いた要素を返します。  
    
  const fruits \= \['りんご', 'バナナ', 'みかん'\];  
    
  const removedFruit \= fruits.shift();  
    
  console.log(fruits);       // 結果: \['バナナ', 'みかん'\]  
    
  console.log(removedFruit); // 結果: 'りんご'  
    
* `splice(開始位置, 削除する数, 追加する要素1, ...)`: **配列の任意の位置の要素を削除、置換、追加**できます。非常に強力なメソッドです。  
    
  const months \= \['1月', '2月', '4月', '5月'\];  
    
  // 2番目の位置から0個削除し、「3月」を追加  
    
  months.splice(2, 0, '3月');  
    
  console.log(months); // 結果: \['1月', '2月', '3月', '4月', '5月'\]  
    
  // 3番目の位置から1個削除  
    
  months.splice(3, 1);  
    
  console.log(months); // 結果: \['1月', '2月', '3月', '5月'\]

#### 配列の操作・変換（元の配列は変更しません）

* `slice(開始位置, 終了位置)`: 配列の**一部を切り出して、新しい配列として返します**。終了位置の要素は含まれません。  
    
  const animals \= \['猿', '犬', '猫', '鳥', '魚'\];  
    
  const domestic \= animals.slice(1, 3); // 1番目から3番目の直前まで  
    
  console.log(domestic); // 結果: \['犬', '猫'\]  
    
  console.log(animals);  // 元の配列は変更されない: \['猿', '犬', '猫', '鳥', '魚'\]  
    
* `concat(配列1, ...)`: **複数の配列や値を連結し、新しい配列を作成**します。  
    
  const arr1 \= \[1, 2, 3\];  
    
  const arr2 \= \[4, 5\];  
    
  const newArray \= arr1.concat(arr2, 6);  
    
  console.log(newArray); // 結果: \[1, 2, 3, 4, 5, 6\]  
    
* `join(区切り文字)`: 配列の**全要素を連結して1つの文字列に変換**します。引数で区切り文字を指定できます。  
    
  const parts \= \['a', 'b', 'c'\];  
    
  console.log(parts.join());   // 結果: "a,b,c" (引数なしはカンマ区切り)  
    
  console.log(parts.join(''));  // 結果: "abc"  
    
  console.log(parts.join('-')); // 結果: "a-b-c"

#### 繰り返し処理（イテレーション）

これらのメソッドは、引数として**コールバック関数**（各要素に対して実行される処理を定義した関数）を受け取ります。

* `forEach(コールバック関数)`: 配列の**各要素に対して、順番に処理を実行**します。戻り値はありません。  
    
  const numbers \= \[1, 2, 3\];  
    
  numbers.forEach(num \=\> {  
    
    console.log(num \* 2); // 2, 4, 6が順番に出力される  
    
  });  
    
* `map(コールバック関数)`: 配列の**各要素を変換し、その結果からなる新しい配列を作成**します。  
    
  const numbers \= \[1, 2, 3\];  
    
  const doubled \= numbers.map(num \=\> num \* 2);  
    
  console.log(doubled); // 結果: \[2, 4, 6\]  
    
* `filter(コールバック関数)`: コールバック関数が`true`を返した**要素だけを集めて、新しい配列を作成**します。  
    
  const numbers \= \[1, 2, 3, 4, 5\];  
    
  const evens \= numbers.filter(num \=\> num % 2 \=== 0); // 偶数のみ抽出  
    
  console.log(evens); // 結果: \[2, 4\]  
    
* `reduce(コールバック関数, 初期値)`: 配列の要素を**左から右へ畳み込み（集約）し、単一の値を生成**します。合計値の計算などによく使われます。  
    
  const numbers \= \[1, 2, 3, 4, 5\];  
    
  // acc: 累積値, curr: 現在の要素  
    
  const sum \= numbers.reduce((acc, curr) \=\> acc \+ curr, 0); // 初期値は0  
    
  console.log(sum); // 結果: 15 (1+2+3+4+5)

#### 要素の検索

* `find(コールバック関数)`: 条件に**最初に一致した要素そのもの**を返します。見つからない場合は `undefined` を返します。  
    
  const users \= \[{id: 1, name: 'A'}, {id: 2, name: 'B'}\];  
    
  const userB \= users.find(user \=\> user.name \=== 'B');  
    
  console.log(userB); // 結果: {id: 2, name: 'B'}  
    
* `findIndex(コールバック関数)`: 条件に\*\*最初に一致した要素のインデックス（位置番号）\*\*を返します。見つからない場合は `-1` を返します。  
    
  const users \= \[{id: 1, name: 'A'}, {id: 2, name: 'B'}\];  
    
  const indexB \= users.findIndex(user \=\> user.name \=== 'B');  
    
  console.log(indexB); // 結果: 1  
    
* `includes(値)`: 配列に**指定した値が含まれているかどうか**を `true` / `false` で返します。  
    
  const fruits \= \['りんご', 'バナナ', 'みかん'\];  
    
  console.log(fruits.includes('バナナ')); // 結果: true  
    
  console.log(fruits.includes('ぶどう')); // 結果: false  
    
* `indexOf(値)`: 配列から**指定した値を検索し、最初のインデックス**を返します。見つからない場合は `-1` を返します。  
    
  const fruits \= \['りんご', 'バナナ', 'みかん', 'バナナ'\];  
    
  console.log(fruits.indexOf('バナナ')); // 結果: 1 (最初に見つかった位置)

---

### 文字列 (String) のメソッド

文字列を操作するためのメソッドです。**文字列のメソッドは、元の文字列を変更しません。**

#### 文字列の検索・判定

* `includes(検索文字列)`: **指定した文字列が含まれているか**を `true` / `false` で返します。  
    
  const text \= 'こんにちは、世界！';  
    
  console.log(text.includes('世界')); // 結果: true  
    
* `startsWith(検索文字列)`: **指定した文字列で始まるか**を `true` / `false` で返します。  
    
  const fileName \= 'image.png';  
    
  console.log(fileName.startsWith('image')); // 結果: true  
    
* `endsWith(検索文字列)`: **指定した文字列で終わるか**を `true` / `false` で返します。  
    
  const fileName \= 'image.png';  
    
  console.log(fileName.endsWith('.png')); // 結果: true

#### 文字列の切り出し・置換

* `slice(開始位置, 終了位置)`: **部分文字列を切り出し**ます。配列の `slice` と同様の動作です。  
    
  const text \= 'JavaScript';  
    
  console.log(text.slice(0, 4));  // 結果: "Java"  
    
  console.log(text.slice(4));     // 結果: "Script" (終了位置を省略すると最後まで)  
    
  console.log(text.slice(-6));    // 結果: "Script" (負の値は末尾からの位置)  
    
* `split(区切り文字)`: 文字列を**指定した区切り文字で分割し、配列にして返します**。  
    
  const csv \= 'apple,orange,grape';  
    
  const fruits \= csv.split(',');  
    
  console.log(fruits); // 結果: \['apple', 'orange', 'grape'\]  
    
* `replace(置換対象, 置換後の文字列)`: **最初に一致した部分文字列を置換**します。  
    
  const text \= '私は猫が好きです。猫はかわいい。';  
    
  const newText \= text.replace('猫', '犬');  
    
  console.log(newText); // 結果: "私は犬が好きです。猫はかわいい。"  
    
* `replaceAll(置換対象, 置換後の文字列)`: **一致した全ての部分文字列を置換**します。  
    
  const text \= '私は猫が好きです。猫はかわいい。';  
    
  const newText \= text.replaceAll('猫', '犬');  
    
  console.log(newText); // 結果: "私は犬が好きです。犬はかわいい。"

#### 文字列の変換

* `toUpperCase()`: 文字列を**すべて大文字に変換**します。  
    
* `toLowerCase()`: 文字列を**すべて小文字に変換**します。  
    
  const text \= 'Hello World';  
    
  console.log(text.toUpperCase()); // 結果: "HELLO WORLD"  
    
  console.log(text.toLowerCase()); // 結果: "hello world"  
    
* `trim()`: 文字列の**両端にある空白文字（スペース、タブなど）を削除**します。  
    
  const text \= '  こんにちは  ';  
    
  console.log(text.trim()); // 結果: "こんにちは"

---

### オブジェクト (Object) の静的メソッド

`Object` コンストラクタから直接呼び出すメソッドです。オブジェクト自体を操作するのに役立ちます。

* `Object.keys(オブジェクト)`: オブジェクトの**キー（プロパティ名）を配列で返します**。  
    
  const user \= { name: '山田', age: 30, country: '日本' };  
    
  console.log(Object.keys(user)); // 結果: \['name', 'age', 'country'\]  
    
* `Object.values(オブジェクト)`: オブジェクトの**値を配列で返します**。  
    
  const user \= { name: '山田', age: 30, country: '日本' };  
    
  console.log(Object.values(user)); // 結果: \['山田', 30, '日本'\]  
    
* `Object.entries(オブジェクト)`: オブジェクトの**キーと値のペアを `[キー, 値]` という形の配列にし、さらにそれらを配列にして返します**。  
    
  const user \= { name: '山田', age: 30 };  
    
  console.log(Object.entries(user)); // 結果: \[ \['name', '山田'\], \['age', 30\] \]  
    
* `Object.assign(ターゲット, ソース1, ...)`: 1つ以上の**ソースオブジェクトのプロパティを、ターゲットオブジェクトにコピー**します。オブジェクトのマージに使われます。  
    
  const target \= { a: 1, b: 2 };  
    
  const source \= { b: 3, c: 4 };  
    
  const merged \= Object.assign(target, source);  
    
  console.log(merged); // 結果: { a: 1, b: 3, c: 4 }  
    
  // 注意: targetオブジェクト自体が変更されます  
    
  console.log(target); // 結果: { a: 1, b: 3, c: 4 }

---

### 数学 (Math) オブジェクトのメソッド

数学的な計算を行うための静的メソッド群です。

* `Math.round(数値)`: **四捨五入**します。  
    
* `Math.floor(数値)`: **切り捨て**（小数点以下を削除）します。  
    
* `Math.ceil(数値)`: **切り上げ**（小数点以下を繰り上げ）します。  
    
  console.log(Math.round(3.5));  // 結果: 4  
    
  console.log(Math.floor(3.9));  // 結果: 3  
    
  console.log(Math.ceil(3.1));   // 結果: 4  
    
* `Math.random()`: **0以上1未満のランダムな小数点数**を返します。  
    
  // 0から9までのランダムな整数を生成する例  
    
  const randomInt \= Math.floor(Math.random() \* 10);  
    
  console.log(randomInt);  
    
* `Math.max(数値1, ...)`: 引数の中で**最大の数**を返します。  
    
* `Math.min(数値1, ...)`: 引数の中で**最小の数**を返します。  
    
  console.log(Math.max(10, 5, 20)); // 結果: 20  
    
  console.log(Math.min(10, 5, 20)); // 結果: 5

---

### 日付 (Date) オブジェクトのメソッド

日付や時刻を扱うためのメソッドです。まず `new Date()` で現在の日時のオブジェクトを作成してから使います。

* `getFullYear()`: **西暦年**を4桁で取得します。  
* `getMonth()`: **月**を0から11で取得します（**0が1月、11が12月なので注意**）。  
* `getDate()`: **日**を1から31で取得します。  
* `getDay()`: **曜日**を0から6で取得します（**0が日曜日、6が土曜日**）。  
* `getHours()`, `getMinutes()`, `getSeconds()`: それぞれ**時、分、秒**を取得します。

const now \= new Date(); // 現在の日時

console.log(now.getFullYear());  // 例: 2023

console.log(now.getMonth() \+ 1); // 月は0始まりなので+1する

console.log(now.getDate());      // 例: 26

console.log(now.getHours());     // 例: 14

* `toLocaleString()`: **環境に合わせた形式の文字列**（例: "2023/10/26 14:30:00"）に変換してくれます。  
    
  const now \= new Date();  
    
  console.log(now.toLocaleString());

---

### JSON オブジェクトのメソッド

JSON (JavaScript Object Notation) 形式のデータを扱うためのメソッドです。

* `JSON.stringify(オブジェクト)`: JavaScriptの**オブジェクトや配列をJSON形式の文字列に変換**します。APIにデータを送信する際などによく使います。  
    
  const user \= { name: '佐藤', age: 25 };  
    
  const jsonString \= JSON.stringify(user);  
    
  console.log(jsonString); // 結果: '{"name":"佐藤","age":25}'  
    
* `JSON.parse(JSON文字列)`: **JSON形式の文字列をJavaScriptのオブジェクトや配列に変換**します。APIからデータを受信した際などによく使います。  
    
  const jsonString \= '{"name":"佐藤","age":25}';  
    
  const user \= JSON.parse(jsonString);  
    
  console.log(user);      // 結果: { name: '佐藤', age: 25 }  
    
  console.log(user.name); // 結果: '佐藤'

---

### その他（デバッグ等で便利なメソッド）

* `console.log()`: **コンソールに情報を出力**します。最も基本的なデバッグ手法です。  
* `console.error()`: エラーメッセージとしてコンソールに出力します。  
* `console.table()`: **配列やオブジェクトを表形式で分かりやすく**コンソールに出力します。  
    
  const users \= \[  
    
    { id: 1, name: 'A', email: 'a@example.com' },  
    
    { id: 2, name: 'B', email: 'b@example.com' }  
    
  \];  
    
  console.table(users); // コンソールに表形式で出力される
