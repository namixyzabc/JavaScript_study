
---

### 1\. Object のメソッド

すべてのオブジェクトの基本となる、最も重要なオブジェクトです。メソッドの多くは、`Object`自体から直接呼び出す**静的メソッド**です。

* **`Object.keys(obj)`** オブジェクトが持つ**キー（プロパティ名）を配列として返します**。ループ処理でキーを順番に取り出したい場合によく使われます。  
    
  const user \= {  
    
    name: '山田太郎',  
    
    age: 30,  
    
    job: 'エンジニア'  
    
  };  
    
  const keys \= Object.keys(user);  
    
  console.log(keys); // 結果: \['name', 'age', 'job'\]  
    
* **`Object.values(obj)`** オブジェクトが持つ**値を配列として返します**。  
    
  const user \= {  
    
    name: '山田太郎',  
    
    age: 30,  
    
    job: 'エンジニア'  
    
  };  
    
  const values \= Object.values(user);  
    
  console.log(values); // 結果: \['山田太郎', 30, 'エンジニア'\]  
    
* **`Object.entries(obj)`** オブジェクトの\*\*\[キー, 値\]のペアを要素とする配列を返します\*\*。`Map`オブジェクトへの変換や、キーと値を同時に使ったループ処理に便利です。  
    
  const user \= {  
    
    name: '山田太郎',  
    
    age: 30  
    
  };  
    
  const entries \= Object.entries(user);  
    
  console.log(entries); // 結果: \[\['name', '山田太郎'\], \['age', 30\]\]  
    
  // for...of文と組み合わせる  
    
  for (const \[key, value\] of Object.entries(user)) {  
    
    console.log(\`${key}: ${value}\`);  
    
  }  
    
  // 結果:  
    
  // name: 山田太郎  
    
  // age: 30  
    
* **`Object.assign(target, ...sources)`** 一つ以上のソースオブジェクトから、ターゲットオブジェクトにプロパティをコピーします。\*\*オブジェクトのマージ（結合）\*\*によく使われます。  
    
  const target \= { a: 1, b: 2 };  
    
  const source \= { b: 3, c: 4 };  
    
  const merged \= Object.assign(target, source);  
    
  console.log(target);   // 結果: { a: 1, b: 3, c: 4 }  
    
  console.log(merged);   // 結果: { a: 1, b: 3, c: 4 }  
    
  // 注意: targetオブジェクト自体が変更されます。  
    
  **ポイント**: 元のオブジェクトを変更したくない場合は、空のオブジェクトを第一引数に指定します。  
    
  const obj1 \= { a: 1 };  
    
  const obj2 \= { b: 2 };  
    
  const newObj \= Object.assign({}, obj1, obj2);  
    
  console.log(newObj); // { a: 1, b: 2 }  
    
  console.log(obj1);   // { a: 1 } (変更されない)  
    
* **`obj.hasOwnProperty(prop)`** オブジェクトが指定されたプロパティを**自分自身のプロパティとして**持っているかどうかを真偽値（true/false）で返します。（継承されたプロパティはfalseになります）  
    
  const user \= { name: '鈴木' };  
    
  console.log(user.hasOwnProperty('name'));      // 結果: true  
    
  console.log(user.hasOwnProperty('toString')); // 結果: false (toStringは継承されたメソッド)

---

### 2\. Array のメソッド

複数のデータを順番に格納する配列（Array）は、JavaScriptで最もよく使われるオブジェクトの一つです。非常に多くの便利なメソッドがあります。

#### 要素の追加・削除

* **`push(element)`**: 配列の**末尾**に要素を追加し、新しい配列の長さを返します。  
* **`pop()`**: 配列の**末尾**の要素を削除し、その削除した要素を返します。  
* **`unshift(element)`**: 配列の**先頭**に要素を追加し、新しい配列の長さを返します。  
* **`shift()`**: 配列の**先頭**の要素を削除し、その削除した要素を返します。

const fruits \= \['りんご', 'バナナ'\];

fruits.push('みかん');

console.log(fruits); // \['りんご', 'バナナ', 'みかん'\]

const lastFruit \= fruits.pop();

console.log(lastFruit); // 'みかん'

console.log(fruits); // \['りんご', 'バナナ'\]

fruits.unshift('レモン');

console.log(fruits); // \['レモン', 'りんご', 'バナナ'\]

const firstFruit \= fruits.shift();

console.log(firstFruit); // 'レモン'

console.log(fruits); // \['りんご', 'バナナ'\]

#### 反復処理（イテレーション）

配列の各要素に対して繰り返し処理を行うメソッド群です。これらを使いこなすことがモダンなJavaScriptプログラミングの鍵となります。

* **`forEach(callback)`**: 各要素に対して、指定された関数（コールバック関数）を一度ずつ実行します。**返り値はありません**。  
    
  const numbers \= \[1, 2, 3\];  
    
  numbers.forEach(num \=\> {  
    
    console.log(num \* 2); // 2, 4, 6が順番に出力される  
    
  });  
    
* **`map(callback)`**: 各要素に対してコールバック関数を実行し、その**結果からなる新しい配列を返します**。元の配列は変更されません。データの変換によく使われます。  
    
  const numbers \= \[1, 2, 3\];  
    
  const doubled \= numbers.map(num \=\> num \* 2);  
    
  console.log(doubled); // 結果: \[2, 4, 6\]  
    
  console.log(numbers); // 結果: \[1, 2, 3\] (元の配列は変わらない)  
    
* **`filter(callback)`**: コールバック関数を実行し、**結果がtrueになる要素だけを集めた新しい配列を返します**。条件に合う要素の絞り込みに使います。  
    
  const numbers \= \[1, 2, 3, 4, 5\];  
    
  const evens \= numbers.filter(num \=\> num % 2 \=== 0);  
    
  console.log(evens); // 結果: \[2, 4\]  
    
* **`reduce(callback, initialValue)`**: 配列の要素を左から右へ、一つの値にまとめ上げます。合計値の計算や、複雑なデータ構造の組み立てに使われます。  
    
  * `callback`は `(accumulator, currentValue) => ...` の形式を取ります。  
  * `accumulator` (累算器): 前回のコールバックの返り値。初回は`initialValue`。  
  * `currentValue`: 現在処理している要素。


  const numbers \= \[1, 2, 3, 4, 5\];


  const sum \= numbers.reduce((total, num) \=\> total \+ num, 0); // 0は初期値


  console.log(sum); // 結果: 15 (0+1+2+3+4+5)


* **`find(callback)`**: 条件に合う**最初の要素を返します**。見つからない場合は `undefined` を返します。  
    
  const users \= \[{id: 1, name: 'A'}, {id: 2, name: 'B'}, {id: 3, name: 'C'}\];  
    
  const userB \= users.find(user \=\> user.name \=== 'B');  
    
  console.log(userB); // 結果: {id: 2, name: 'B'}  
    
* **`some(callback)`**: 条件に合う要素が\*\*一つでもあれば`true`\*\*を返します。  
    
* **`every(callback)`**: **すべての要素**が条件に合えば`true`を返します。  
    
  const numbers \= \[1, 3, 5, 7, 8\];  
    
  const hasEven \= numbers.some(num \=\> num % 2 \=== 0);  
    
  console.log(hasEven); // 結果: true (8が偶数)  
    
  const allOdd \= numbers.every(num \=\> num % 2 \!== 0);  
    
  console.log(allOdd); // 結果: false (8が偶数)

#### その他

* **`includes(value)`**: 配列に指定した値が含まれているかを`true`/`false`で返します。  
* **`join(separator)`**: 配列の全要素を連結した一つの文字列を返します。引数で区切り文字を指定できます。  
* **`slice(start, end)`**: 配列の一部を**新しい配列として**切り出します。元の配列は変更されません。  
* **`splice(start, deleteCount, ...items)`**: 配列の要素を削除、置換、または追加します。**元の配列を直接変更します**。  
* **`sort(compareFunction)`**: 配列の要素を並べ替えます。**元の配列を直接変更します**。 **重要**: 引数なしだと要素を文字列として比較します。数値のソートには比較関数が必要です。  
    
  const numbers \= \[10, 5, 100, 1\];  
    
  // 文字列としてソートされるため、意図しない結果になる  
    
  // numbers.sort(); // \[1, 10, 100, 5\]  
    
  // 数値として正しくソートする  
    
  numbers.sort((a, b) \=\> a \- b); // 昇順  
    
  console.log(numbers); // 結果: \[1, 5, 10, 100\]  
    
  numbers.sort((a, b) \=\> b \- a); // 降順  
    
  console.log(numbers); // 結果: \[100, 10, 5, 1\]

---

### 3\. String のメソッド

文字列を操作するためのメソッドです。文字列は不変（immutable）なため、**これらのメソッドは新しい文字列を返し、元の文字列は変更しません**。

* **`slice(startIndex, endIndex)`**: 文字列の一部を切り出して新しい文字列として返します。  
    
* **`substring(startIndex, endIndex)`**: `slice`と似ていますが、引数の大小関係を自動で解釈するなどの違いがあります。  
    
* **`split(separator)`**: 文字列を区切り文字で分割し、配列にして返します。  
    
  const text \= 'apple,orange,banana';  
    
  const fruits \= text.split(',');  
    
  console.log(fruits); // 結果: \['apple', 'orange', 'banana'\]  
    
* **`replace(pattern, replacement)`**: 文字列内で最初に`pattern`に一致した部分を`replacement`に置き換えます。  
    
* **`replaceAll(pattern, replacement)`**: `pattern`に一致したすべての部分を置き換えます。  
    
  const message \= 'Hello world, beautiful world\!';  
    
  const newMessage \= message.replace('world', 'JavaScript');  
    
  console.log(newMessage); // 結果: 'Hello JavaScript, beautiful world\!'  
    
  const newAllMessage \= message.replaceAll('world', 'JavaScript');  
    
  console.log(newAllMessage); // 結果: 'Hello JavaScript, beautiful JavaScript\!'  
    
* **`toLowerCase()` / `toUpperCase()`**: 文字列を小文字/大文字に変換します。  
    
* **`trim()`**: 文字列の**前後の空白**（スペース、タブ、改行など）を削除します。  
    
* **`includes(searchString)`**: 文字列に指定した部分文字列が含まれているかを`true`/`false`で返します。  
    
* **`startsWith(searchString)` / `endsWith(searchString)`**: 文字列が指定した部分文字列で始まるか/終わるかを`true`/`false`で返します。

---

### 4\. Math のメソッド

数値計算を行うための静的メソッドを提供します。`new Math()`のようにインスタンス化はしません。

* **`Math.round(x)`**: 四捨五入します。  
    
* **`Math.floor(x)`**: 切り捨てます（x以下の最大の整数）。  
    
* **`Math.ceil(x)`**: 切り上げます（x以上の最小の整数）。  
    
  console.log(Math.round(3.5)); // 4  
    
  console.log(Math.floor(3.9)); // 3  
    
  console.log(Math.ceil(3.1));  // 4  
    
* **`Math.random()`**: **0以上1未満**の擬似乱数を返します。 **実践例**: 1から10までのランダムな整数を生成する。  
    
  const randomInt \= Math.floor(Math.random() \* 10\) \+ 1;  
    
  console.log(randomInt); // 1から10のいずれかの整数  
    
* **`Math.max(...values)` / `Math.min(...values)`**: 引数の中で最大/最小の値を返します。  
    
  const numbers \= \[10, 5, 30, \-1\];  
    
  // 配列を渡す場合はスプレッド構文(...)を使う  
    
  console.log(Math.max(...numbers)); // 30  
    
  console.log(Math.min(...numbers)); // \-1

---

### 5\. Date のメソッド

日時を扱うためのオブジェクトです。`new Date()`で現在の日時を持つインスタンスを生成します。

* **`getFullYear()` / `getMonth()` / `getDate()`**: 年/月/日を取得します。 **重要**: `getMonth()`は **0から始まる**ため注意が必要です（0が1月、11が12月）。  
    
* **`getHours()` / `getMinutes()` / `getSeconds()`**: 時/分/秒を取得します。  
    
* **`getTime()`**: 1970年1月1日 00:00:00 UTCからの経過ミリ秒（タイムスタンプ）を返します。  
    
  const now \= new Date();  
    
  const year \= now.getFullYear();  
    
  const month \= now.getMonth() \+ 1; // 0始まりなので+1する  
    
  const day \= now.getDate();  
    
  console.log(\`${year}年${month}月${day}日\`);  
    
* **`toLocaleString(locales, options)`**: 日時を地域の言語や形式に合わせた文字列に変換します。  
    
  const now \= new Date();  
    
  const options \= { year: 'numeric', month: 'long', day: 'numeric' };  
    
  console.log(now.toLocaleString('ja-JP', options)); // 例: 2023年10月27日

---

### 6\. JSON のメソッド

JSON (JavaScript Object Notation) 形式のデータを扱うための静的メソッドを提供します。API通信などで必須の知識です。

* **`JSON.stringify(value)`**: JavaScriptのオブジェクトや値を**JSON形式の文字列に変換します**。  
    
  const user \= {  
    
    name: '佐藤',  
    
    age: 25,  
    
    isMember: true  
    
  };  
    
  const jsonString \= JSON.stringify(user);  
    
  console.log(jsonString);  
    
  // 結果: '{"name":"佐藤","age":25,"isMember":true}'  
    
* **`JSON.parse(text)`**: JSON形式の文字列を**JavaScriptのオブジェクトや値に変換（解析）します**。  
    
  const jsonString \= '{"name":"佐藤","age":25,"isMember":true}';  
    
  const userObject \= JSON.parse(jsonString);  
    
  console.log(userObject.name); // 結果: '佐藤'

---

### 7\. Map と Set のメソッド

ES2015から導入された新しいコレクションです。

#### Map

キーと値のペアを保持します。Objectと似ていますが、**キーに文字列以外の型（オブジェクトなど）も使えます**。

* **`set(key, value)`**: キーと値のペアを追加します。  
* **`get(key)`**: キーに対応する値を取得します。  
* **`has(key)`**: キーが存在するかを`true`/`false`で返します。  
* **`delete(key)`**: キーと値のペアを削除します。  
* **`size`**: (プロパティ) 要素数を返します。

const userMap \= new Map();

userMap.set('name', '高橋');

userMap.set('age', 28);

console.log(userMap.get('name')); // '高橋'

console.log(userMap.has('job'));  // false

console.log(userMap.size);        // 2

#### Set

重複しない値のコレクションです。**値のユニーク性を保証したい場合**に非常に便利です。

* **`add(value)`**: 値を追加します。すでに存在する場合は何も起きません。  
* **`has(value)`**: 値が存在するかを`true`/`false`で返します。  
* **`delete(value)`**: 値を削除します。  
* **`size`**: (プロパティ) 要素数を返します。

const numbers \= \[1, 2, 2, 3, 4, 4, 5\];

const uniqueNumbers \= new Set(numbers);

console.log(uniqueNumbers); // Set(5) { 1, 2, 3, 4, 5 }

uniqueNumbers.add(5); // すでに存在するので変化なし

uniqueNumbers.add(6);

console.log(uniqueNumbers); // Set(6) { 1, 2, 3, 4, 5, 6 }

// 配列の重複を削除する簡単な方法

const uniqueArray \= \[...new Set(numbers)\];

console.log(uniqueArray); // \[1, 2, 3, 4, 5\]
