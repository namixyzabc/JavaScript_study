
---

### 1\. 制御フローステートメント

プログラムの実行順序を制御するためのステートメントです。

#### 1.1. 条件分岐

##### `if...else` 文

**もし条件が真（true）であれば特定の処理を行い、そうでなければ別の処理を行う**ために使います。最も基本的な条件分岐です。

const age \= 20;

if (age \>= 20\) {

  console.log("成人です。");

} else if (age \>= 13\) {

  console.log("ティーンエイジャーです。");

} else {

  console.log("子どもです。");

}

// 出力: 成人です。

- `if`：最初の条件を評価します。  
- `else if`：前の`if`または`else if`の条件が偽の場合に、次の条件を評価します。いくつでも追加できます。  
- `else`：全ての`if`, `else if`の条件が偽の場合に実行されます。

##### `switch` 文

**一つの式の値に基づいて、複数のケース（場合）の中から一致する処理を実行します。**`if...else`を何度も繰り返すよりもコードがすっきりする場合に便利です。

const signal \= "blue";

switch (signal) {

  case "red":

    console.log("止まれ");

    break; // breakを忘れると次のcaseも実行されてしまうので注意

  case "yellow":

    console.log("注意");

    break;

  case "blue":

    console.log("進め");

    break;

  default: // どのcaseにも一致しない場合に実行される

    console.log("信号機が故障しています");

    break;

}

// 出力: 進め

**`break`ステートメントは、`switch`文の処理を終了させるために不可欠です。**

---

#### 1.2. ループ（繰り返し）

##### `for` 文

**指定した回数だけ処理を繰り返す**場合に使用します。カウンター変数を使ってループを制御するのが一般的です。

let total \= 0;

// iが0から始まり、4になるまで1ずつ増やしながら繰り返す

for (let i \= 0; i \< 5; i++) {

  total \+= i; // total \= total \+ i と同じ

  console.log(\`i=${i}, total=${total}\`);

}

console.log("最終的な合計:", total); // 最終的な合計: 10

##### `while` 文

**指定した条件が真（true）である間、処理を繰り返します。** ループの回数が事前にわからない場合に使われます。

let count \= 0;

while (count \< 3\) {

  console.log(\`現在のカウント: ${count}\`);

  count++;

}

// 出力:

// 現在のカウント: 0

// 現在のカウント: 1

// 現在のカウント: 2

**無限ループにならないよう、ループ内で条件式の変数を更新する必要があります。**

##### `do...while` 文

`while`文と似ていますが、**条件の評価を後で行うため、ブロック内の処理が最低1回は必ず実行されます。**

let num \= 5;

do {

  console.log("この処理は最低1回実行されます。"); // この行は実行される

} while (num \< 3); // 条件は偽だが、先に処理が実行される

##### `for...in` 文

**オブジェクトが持つプロパティ（キー）に対して、順番に処理を繰り返します。**

const person \= {

  name: "山田",

  age: 30,

  job: "エンジニア"

};

for (const key in person) {

  // keyにはプロパティ名（name, age, job）が入る

  console.log(\`${key}: ${person\[key\]}\`);

}

// 出力:

// name: 山田

// age: 30

// job: エンジニア

##### `for...of` 文

**配列や文字列など、反復可能（iterable）なオブジェクトの各要素に対して処理を繰り返します。** こちらの方が配列のループにはよく使われます。

const fruits \= \["りんご", "バナナ", "みかん"\];

for (const fruit of fruits) {

  // fruitには配列の要素が直接入る

  console.log(fruit);

}

// 出力:

// りんご

// バナナ

// みかん

#### 1.3. ループの制御

##### `break` 文

**現在のループ処理（`for`, `while`など）や`switch`文を即座に中断します。**

for (let i \= 0; i \< 10; i++) {

  if (i \=== 5\) {

    break; // iが5になった時点でループを抜ける

  }

  console.log(i); // 0, 1, 2, 3, 4 が出力される

}

##### `continue` 文

**現在のループの反復処理だけをスキップし、次の反復処理に進みます。**

for (let i \= 0; i \< 5; i++) {

  if (i \=== 2\) {

    continue; // iが2の時だけ処理をスキップする

  }

  console.log(i); // 0, 1, 3, 4 が出力される (2はスキップ)

}

---

### 2\. 宣言ステートメント

変数、定数、関数、クラスなどを定義（宣言）するためのステートメントです。

##### `let`

**再代入が可能な変数を宣言します。** 同じスコープ内での再宣言はできません。 **現代のJavaScriptでは`var`より`let`の使用が推奨されます。**

let message \= "こんにちは";

message \= "こんばんは"; // 再代入はOK

console.log(message); // こんばんは

// let message \= "さようなら"; // エラー: 同じ名前での再宣言は不可

##### `const`

**再代入が不可能な定数を宣言します。** 宣言時に必ず値を初期化する必要があります。 オブジェクトや配列を`const`で宣言した場合、**中身の要素やプロパティの変更は可能**です。

const PI \= 3.14;

// PI \= 3.14159; // エラー: 再代入は不可

const user \= { name: "佐藤" };

user.name \= "鈴木"; // OK: オブジェクトのプロパティは変更可能

console.log(user.name); // 鈴木

##### `function`

**関数を宣言します。**

function greet(name) {

  return \`こんにちは、${name}さん！\`;

}

const greeting \= greet("田中");

console.log(greeting); // こんにちは、田中さん！

##### `class`

**オブジェクト指向プログラミングで使われる、オブジェクトの設計図（クラス）を宣言します。**

class Animal {

  constructor(name) {

    this.name \= name;

  }

  speak() {

    console.log(\`${this.name}が鳴きました。\`);

  }

}

const dog \= new Animal("犬");

dog.speak(); // 犬が鳴きました。

---

### 3\. エラーハンドリングステートメント

エラーが発生する可能性のある処理を安全に実行するためのステートメントです。

##### `try...catch...finally` 文

- `try`ブロック：**エラーが発生する可能性のあるコードを記述します。**  
- `catch`ブロック：`try`ブロック内でエラーが発生した場合に実行されるコードを記述します。  
- `finally`ブロック：エラーの有無にかかわらず、最後に必ず実行されるコードを記述します（省略可能）。

try {

  // 存在しない関数を呼び出す

  nonExistentFunction();

} catch (error) {

  // エラーを捕捉して処理する

  console.error("エラーが発生しました:", error.message);

} finally {

  console.log("この処理は必ず実行されます。");

}

##### `throw` 文

**意図的にエラー（例外）を発生させます。**

function divide(a, b) {

  if (b \=== 0\) {

    // 0で割ろうとしたらエラーを投げる

    throw new Error("0で割ることはできません。");

  }

  return a / b;

}

try {

  console.log(divide(10, 0));

} catch (e) {

  console.error(e.message); // 0で割ることはできません。

}

---

### 4\. モジュールステートメント

コードをファイル単位で分割し、再利用しやすくするためのステートメントです。

##### `export`

**現在のファイル（モジュール）から、関数、クラス、変数を他のファイルで使えるように公開します。**

// math.js ファイル

export const add \= (a, b) \=\> a \+ b;

export const PI \= 3.14;

##### `import`

**他のファイル（モジュール）から`export`された機能を取り込みます。**

// main.js ファイル

import { add, PI } from './math.js';

console.log(add(5, 3));    // 8

console.log(PI);           // 3.14

---

### 5\. その他の重要なステートメント

##### `return` 文

**関数の実行を終了し、指定した値を呼び出し元に返します。** `return`が実行されると、それ以降の関数のコードは実行されません。

function checkAge(age) {

  if (age \< 18\) {

    return "未成年です。"; // ここで関数の実行が終了する

  }

  return "成人です。";

}

console.log(checkAge(15)); // 未成年です。

##### `debugger`

コードの実行をその場で一時停止させ、ブラウザの開発者ツールなどでデバッグ（問題の調査）を開始するための命令です。

let x \= 10;

let y \= 20;

debugger; // 開発者ツールが開いている場合、ここでコードの実行が止まる

let z \= x \+ y;

console.log(z);
