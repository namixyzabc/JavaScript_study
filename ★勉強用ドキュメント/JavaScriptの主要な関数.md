
### 1\. 関数とは何か？

関数とは、**一連の処理を一つにまとめたもの**です。特定のタスクを実行するための命令のブロックであり、名前を付けて何度も呼び出すことができます。

**なぜ関数を使うのか？**

* **コードの再利用**: 同じ処理を何度も書く必要がなくなります。  
* **可読性の向上**: 処理に名前を付けることで、コードが何をしているのかが分かりやすくなります。  
* **保守性の向上**: 修正が必要な場合、該当する関数を一つ修正するだけで済みます。

---

### 2\. 関数の基本的な作り方（定義方法）

JavaScriptには、主に関数を定義する方法が3つあります。

#### ① 関数宣言 (Function Declaration)

最も基本的な書き方です。`function`キーワードで始めます。

// 'name'という値を受け取り、挨拶文をコンソールに表示する関数

function greet(name) {

  console.log('こんにちは、' \+ name \+ 'さん！');

}

// 関数の呼び出し

greet('山田'); // 出力: こんにちは、山田さん！

* **特徴**: \*\*巻き上げ（Hoisting）\*\*という性質があります。これは、コードが実行される前に関数宣言がメモリの先頭に引き上げられるため、定義より前の行で関数を呼び出してもエラーにならないというものです。

#### ② 関数式 (Function Expression)

関数を値として扱い、変数に代入する書き方です。

// 関数を定義し、変数'greet'に代入する

const greet \= function(name) {

  console.log('こんにちは、' \+ name \+ 'さん！');

};

// 関数の呼び出し

greet('佐藤'); // 出力: こんにちは、佐藤さん！

* **特徴**: 関数宣言とは異なり、**巻き上げは発生しません**。変数に代入される前に呼び出すとエラーになります。

#### ③ アロー関数 (Arrow Function)

ES2015から導入された、より短く簡潔に関数を書くための構文です。

// アロー関数で定義

const greet \= (name) \=\> {

  console.log('こんにちは、' \+ name \+ 'さん！');

};

greet('鈴木'); // 出力: こんにちは、鈴木さん！

* **特徴**:  
    
  * `function`キーワードが不要です。  
  * 処理が1行で終わり、その結果を返す場合は`{}`と`return`を省略できます。


  // aとbを足した結果を返すアロー関数


  const add \= (a, b) \=\> a \+ b;


  const result \= add(5, 3);


  console.log(result); // 出力: 8


  * 後述する\*\*`this`の扱いが異なります\*\*。これは非常に重要なポイントです。

---

### 3\. 関数の要素：引数と戻り値

#### 引数 (Arguments)

関数に渡す値のことです。これにより、関数はより柔軟な処理が可能になります。

* **デフォルト引数**: 引数が渡されなかった場合の初期値を設定できます。  
    
  function greet(name \= 'ゲスト') { // nameが指定されなければ'ゲスト'が使われる  
    
    console.log('こんにちは、' \+ name \+ 'さん！');  
    
  }  
    
  greet(); // 出力: こんにちは、ゲストさん！  
    
* **残余引数 (Rest Parameters)**: 不特定多数の引数を配列として受け取ることができます。  
    
  function sum(...numbers) { // ...を付けると残りの引数が配列になる  
    
    let total \= 0;  
    
    for (const num of numbers) {  
    
      total \+= num;  
    
    }  
    
    return total;  
    
  }  
    
  console.log(sum(1, 2, 3));       // 出力: 6  
    
  console.log(sum(10, 20, 30, 40)); // 出力: 100

#### 戻り値 (Return Value)

関数の処理結果を呼び出し元に返す値のことです。`return`キーワードを使います。

function createGreetingMessage(name) {

  // 文字列を作成して返す

  return 'こんにちは、' \+ name \+ 'さん！';

}

const message \= createGreetingMessage('田中');

console.log(message); // 出力: こんにちは、田中さん！

* `return`が書かれていない関数は、自動的に`undefined`という値を返します。

---

### 4\. スコープ：変数が使える範囲

スコープとは、変数が有効な範囲のことです。意図しない変数の上書きを防ぐために非常に重要です。

* **グローバルスコープ**: 関数の外で定義された変数。コードのどこからでもアクセスできます。  
* **ローカルスコープ（関数スコープ）**: 関数の内部で定義された変数。その関数の中でのみアクセスできます。

const globalVar \= '私はグローバルです'; // グローバルスコープ

function checkScope() {

  const localVar \= '私はローカルです'; // ローカルスコープ

  console.log(globalVar); // グローバル変数は中からアクセス可能

  console.log(localVar);  // ローカル変数はもちろんアクセス可能

}

checkScope();

// 出力:

// 私はグローバルです

// 私はローカルです

console.log(globalVar); // 外からグローバル変数にアクセス可能

// console.log(localVar); // エラー！外からローカル変数にはアクセスできない

---

### 5\. クロージャ (Closure)

クロージャは少し高度な概念ですが、非常に強力です。 **「関数」と「その関数が作られたときの環境（スコープ）」をセットで記憶する仕組み**です。

これにより、関数の実行が終わった後でも、その関数が作られたときの変数を保持し続けることができます。

**例：カウンター関数**

function createCounter() {

  let count \= 0; // この変数は外から直接アクセスできない

  // 内側の関数を返す

  return function() {

    count++;

    console.log(count);

  };

}

const counter1 \= createCounter(); // counter1には、count=0の状態を記憶した関数が入る

counter1(); // 出力: 1

counter1(); // 出力: 2

const counter2 \= createCounter(); // 新しいカウンターを作成。countは再び0から始まる

counter2(); // 出力: 1

* `createCounter`関数が実行された後でも、その内部変数`count`は破棄されず、返された内側の関数によって保持されています。  
* このように、**状態をプライベートに保ちたい場合**（外から勝手に値を変更されたくない場合）にクロージャは役立ちます。

---

### 6\. 高階関数 (Higher-Order Function)

**関数を引数として受け取る、または関数を戻り値として返す関数**を高階関数と呼びます。JavaScriptでは、関数はオブジェクトと同じように扱える（第一級オブジェクト）ため、これが可能です。

#### コールバック関数

高階関数に引数として渡される関数のことを**コールバック関数**と呼びます。文字通り「後で呼び出される (call back)」関数です。

配列のメソッドでよく使われます。

const numbers \= \[1, 2, 3, 4, 5\];

// map: 各要素を変換して新しい配列を作る高階関数

// (n) \=\> n \* 2 の部分がコールバック関数

const doubledNumbers \= numbers.map((n) \=\> n \* 2);

console.log(doubledNumbers); // 出力: \[2, 4, 6, 8, 10\]

// filter: 条件に合う要素だけを集めて新しい配列を作る高階関数

// (n) \=\> n % 2 \=== 0 の部分がコールバック関数

const evenNumbers \= numbers.filter((n) \=\> n % 2 \=== 0);

console.log(evenNumbers); // 出力: \[2, 4\]

---

### 7\. `this` キーワード

`this`は、**関数がどのように呼び出されたか（実行コンテキスト）によって参照先が変わる**特別なキーワードです。これはJavaScriptの中でも特に混乱しやすいポイントです。

| 呼び出し方 | `this` が指すもの |
| :---- | :---- |
| メソッドとして (`obj.func()`) | そのオブジェクト (`obj`) |
| 通常の関数として (`func()`) | グローバルオブジェクト (`window`) or `undefined` (strict mode) |
| `new` と一緒に (`new Func()`) | 新しく作成されるインスタンス |
| **アロー関数内** | **定義された場所の`this`をそのまま引き継ぐ** |

**例：メソッドとしての呼び出し**

const person \= {

  name: '田中',

  greet: function() {

    // この'this'はpersonオブジェクトを指す

    console.log('こんにちは、' \+ this.name \+ 'です。');

  }

};

person.greet(); // 出力: こんにちは、田中です。

**例：アロー関数の`this`** アロー関数は自身の`this`を持たず、外側のスコープの`this`を継承します。これが非常に便利です。

const person2 \= {

  name: '鈴木',

  hobbies: \['旅行', '読書'\],

  showHobbies: function() {

    // この時点でのthisはperson2オブジェクト

    this.hobbies.forEach((hobby) \=\> {

      // アロー関数なので、外側のthis(person2)をそのまま使う

      console.log(this.name \+ 'の趣味は' \+ hobby \+ 'です。');

    });

  }

};

person2.showHobbies();

// 出力:

// 鈴木の趣味は旅行です。

// 鈴木の趣味は読書です。

もし`forEach`の中が通常の`function`だった場合、その中の`this`はグローバルオブジェクトを指してしまい、期待通りに動作しません。

---

### 8\. 非同期処理と関数 (`async`/`await`)

サーバーからデータを取得するなど、時間がかかる処理は**非同期**で行われます。`async`/`await`は、この非同期処理を同期処理のように直感的に書くための構文です。

* `async`: 関数名の前に付けると、その関数は必ず**Promise**（非同期処理の結果を表すオブジェクト）を返すようになります。  
* `await`: `async`関数の中でのみ使え、Promiseの結果が返ってくるまで処理を一時停止します。

// データを取得する非同期関数（のダミー）

function fetchData() {

  return new Promise(resolve \=\> {

    setTimeout(() \=\> {

      resolve({ id: 1, name: '商品A' });

    }, 1500); // 1.5秒後にデータを返す

  });

}

// async/await を使ってデータを取得・表示する

async function displayData() {

  console.log('データ取得を開始します...');

  try {

    // fetchDataが終わるまでここで待つ

    const data \= await fetchData();

    console.log('取得したデータ:', data);

  } catch (error) {

    console.error('エラーが発生しました:', error);

  }

  console.log('データ取得が完了しました。');

}

displayData();

// 出力:

// データ取得を開始します...

// (1.5秒後)

// 取得したデータ: {id: 1, name: "商品A"}

// データ取得が完了しました。

---

### 9\. 主要な組み込み（ビルトイン）関数・メソッド

JavaScriptには、最初から用意されている便利な関数（正確にはオブジェクトのメソッド）がたくさんあります。

#### 文字列 (String)

* `slice(start, end)`: 文字列の一部を切り出す。  
* `split(separator)`: 指定した文字で文字列を分割し、配列にする。  
* `replace(old, new)`: 文字列を置換する。  
* `toLowerCase()` / `toUpperCase()`: 小文字/大文字に変換する。

#### 配列 (Array)

* `forEach(callback)`: 各要素に対して処理を実行する。  
* `map(callback)`: 各要素を変換し、新しい配列を返す。  
* `filter(callback)`: 条件に合う要素だけを集め、新しい配列を返す。  
* `reduce(callback, initialValue)`: 全要素を一つの値に集約する。  
* `find(callback)`: 条件に合う最初の要素を返す。  
* `push(item)` / `pop()`: 配列の末尾に要素を追加/削除する。  
* `join(separator)`: 配列の要素を連結して一つの文字列にする。  
* `includes(item)`: 特定の要素が含まれているか真偽値で返す。

#### その他

* `parseInt(string)`: 文字列を整数に変換する。  
* `JSON.stringify(object)`: オブジェクトをJSON形式の文字列に変換する。  
* `JSON.parse(string)`: JSON形式の文字列をオブジェクトに変換する。  
* `setTimeout(callback, ms)`: 指定した時間(ミリ秒)後に関数を実行する。
