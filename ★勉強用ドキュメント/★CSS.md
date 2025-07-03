### CSSの解説

#### 1. CSSとは何か？

CSS（Cascading Style Sheets）は、ウェブページの**見た目や装飾を定義するための言語**です。HTMLがウェブページの「骨格」や「内容」を定義するのに対し、CSSは「デザイン」を担当します。

*   **HTML**: 見出し、段落、画像などの要素を配置する（構造）。
*   **CSS**: 色、フォント、レイアウト、余白などを指定する（装飾）。

この2つを分離することで、ウェブサイトの**構造とデザインを分けて管理でき、保守性や再利用性が向上します**。

---

#### 2. CSSの基本的な書き方

CSSを記述するには、主に3つの方法があります。

1.  **外部スタイルシート（推奨）**
    HTMLファイルとは別に`.css`という拡張子のファイルを作成し、HTMLから読み込みます。**最も一般的で推奨される方法**です。サイト全体で同じスタイルを共有できるため、管理が非常に楽になります。

    **style.css**
    ```css
    body {
      font-family: sans-serif;
    }
    ```

    **index.html**
    ```html
    <head>
      <link rel="stylesheet" href="style.css">
    </head>
    <body>
      <!-- ... -->
    </body>
    ```

2.  **内部スタイルシート**
    HTMLファイルの`<head>`タグ内に`<style>`タグを使って記述する方法です。そのページだけに適用したいスタイルがある場合に便利です。

    **index.html**
    ```html
    <head>
      <style>
        h1 {
          color: navy;
        }
      </style>
    </head>
    ```

3.  **インラインスタイル**
    HTMLタグの`style`属性に直接記述する方法です。特定の要素にだけ、少しだけスタイルを適用したい場合に使いますが、**多用すると管理が複雑になるため、避けるべき**とされています。

    **index.html**
    ```html
    <p style="color: red; font-size: 20px;">この部分だけ赤くなります。</p>
    ```

---

#### 3. CSSの基本構文

CSSは「**セレクタ**」と「**宣言ブロック**」の組み合わせで構成されます。

```css
/* 例：h1要素の文字色を青に、フォントサイズを24pxにする */
h1 {
  color: blue;
  font-size: 24px;
}
```

*   **セレクタ (`h1`)**: どのHTML要素にスタイルを適用するかを指定します。
*   **宣言ブロック (`{...}`)**: 具体的なスタイルの内容を記述します。
*   **プロパティ (`color`)**: スタイルの種類（文字色、背景色など）を指定します。
*   **値 (`blue`)**: プロパティに設定する具体的な値を指定します。
*   **宣言 (`color: blue;`)**: プロパティと値のセットです。セミコロン(`;`)で区切ります。

---

#### 4. セレクタ：どの要素を選ぶか

セレクタは、スタイルを適用したいHTML要素を正確に指定するための重要な機能です。

##### 基本的なセレクタ

*   **要素セレクタ**: タグ名をそのまま指定します。
    ```css
    p { /* すべての <p> タグ */
      line-height: 1.6;
    }
    ```
*   **クラスセレクタ**: `.`（ドット）に続けてクラス名を指定します。**複数の要素に同じスタイルを適用したい**場合に使います。
    ```css
    .button-primary { /* class="button-primary" を持つすべての要素 */
      background-color: dodgerblue;
      color: white;
    }
    ```
*   **IDセレクタ**: `#`（シャープ）に続けてID名を指定します。IDは**ページ内で一意（ユニーク）**でなければならず、特定の要素にだけ使います。
    ```css
    #header { /* id="header" を持つ要素 */
      padding: 20px;
    }
    ```

##### 組み合わせるセレクタ

*   **子孫セレクタ** (` `): ある要素の中にあるすべての子孫要素を指定します。
    ```css
    /* article要素の中にあるすべてのp要素 */
    article p {
      color: #333;
    }
    ```
*   **子セレクタ** (`>`): ある要素の直下にある子要素のみを指定します。
    ```css
    /* ul要素の直下にあるli要素のみ */
    ul > li {
      list-style-type: square;
    }
    ```
*   **隣接兄弟セレクタ** (`+`): ある要素の直後にある兄弟要素を指定します。
    ```css
    /* h2要素のすぐ隣にあるp要素 */
    h2 + p {
      margin-top: 0;
    }
    ```

##### 疑似クラスと疑似要素

*   **疑似クラス**: 要素の**特定の状態**を指定します。
    *   `:hover`: マウスカーソルが乗っている状態
    *   `:focus`: フォームの入力欄などが選択されている状態
    *   `:nth-child(n)`: n番目の子要素
    ```css
    /* aタグにマウスが乗ったら下線を付ける */
    a:hover {
      text-decoration: underline;
    }
    /* リストの奇数番目の背景色を変える */
    li:nth-child(odd) {
      background-color: #f2f2f2;
    }
    ```
*   **疑似要素**: 要素の**特定の部分**にスタイルを適用します。
    *   `::before`: 要素の直前に内容を追加する
    *   `::after`: 要素の直後に内容を追加する
    *   `::first-letter`: 最初の文字
    ```css
    /* p要素の最初の文字だけ大きくする */
    p::first-letter {
      font-size: 2em;
    }
    ```

##### セレクタの優先順位（詳細度）

スタイルが競合した場合、どのスタイルが適用されるかは**セレクタの優先順位**によって決まります。

**!important > インラインスタイル > IDセレクタ > クラス・属性・疑似クラスセレクタ > 要素セレクタ > ユニバーサルセレクタ(`*`)**

基本的には、**より具体的に指定しているセレクタほど優先度が高くなります**。
`!important`は強制的にスタイルを適用しますが、多用するとCSSの管理が困難になるため、最終手段として考えましょう。

---

#### 5. ボックスモデル：すべての要素は箱

CSSでは、**すべてのHTML要素は長方形の「箱」として扱われます**。この箱は4つの要素で構成されます。



*   **`content`**: テキストや画像が表示される中心部分。`width`と`height`でサイズを指定します。
*   **`padding`**: コンテンツと境界線の間の**内側の余白**です。
*   **`border`**: `padding`の外側にある**境界線**です。太さ、種類、色を指定できます。
*   **`margin`**: `border`の外側にある**外側の余白**です。他の要素との距離を調整します。

```css
.box {
  width: 300px;
  height: 150px;
  padding: 20px; /* 内側の余白 */
  border: 5px solid black; /* 境界線 */
  margin: 10px; /* 外側の余白 */
  background-color: lightgray;
}
```

**重要なポイント**:
デフォルトでは、`width`と`height`は`content`部分のサイズのみを指します。`padding`や`border`を加えると、箱全体の大きさが意図せず変わってしまいます。
これを解決するため、**`box-sizing: border-box;`** を指定するのが一般的です。これにより、**`width`と`height`が`padding`と`border`を含んだサイズ**として計算されるようになり、レイアウトが非常に直感的になります。

```css
/* すべての要素に適用するのが一般的 */
* {
  box-sizing: border-box;
}
```

---

#### 6. よく使うプロパティ

##### 文字・テキスト関連

*   `color`: 文字色
*   `font-family`: フォントの種類（ゴシック体、明朝体など）
*   `font-size`: 文字の大きさ（`px`, `rem`, `em`など）
*   `font-weight`: 文字の太さ（`normal`, `bold`）
*   `text-align`: テキストの水平方向の配置（`left`, `center`, `right`）
*   `line-height`: 行の高さ。文字サイズより大きくすると行間が空きます。

##### 背景関連

*   `background-color`: 背景色
*   `background-image`: 背景画像 (`url('image.jpg')`)
*   `background-size`: 背景画像のサイズ（`cover`, `contain`）
*   `background-position`: 背景画像の位置（`center`）

##### 表示・配置関連

*   `display`: 要素の表示形式を定義します。
    *   `block`: 幅いっぱいに広がり、前後に改行が入る（`div`, `p`, `h1`など）。
    *   `inline`: テキストのように流れ込み、幅や高さは指定できない（`span`, `a`など）。
    *   `inline-block`: `inline`のように流れ込むが、`block`のように幅や高さを指定できる。
    *   `none`: 要素を非表示にする。
*   `position`: 要素の配置方法を制御します。
    *   `static`: 初期値。
    *   `relative`: 本来の位置を基準に `top`, `right`, `bottom`, `left` で位置を調整できます。
    *   `absolute`: 親要素の中で`position: static`以外の最も近い要素を基準に、絶対位置で配置されます。
    *   `fixed`: ブラウザの表示領域（ウィンドウ）を基準に、絶対位置で固定されます。スクロールしても動きません。

---

#### 7. モダンなレイアウト手法：FlexboxとGrid

以前は`float`プロパティでレイアウトを組むのが主流でしたが、複雑になりがちでした。現在は**Flexbox**と**CSS Grid**が主流です。

##### Flexbox（フレックスボックス）

**一次元（横一列、または縦一列）のレイアウト**を簡単に実現できます。ナビゲーションメニューや項目リストの横並びに最適です。

*   **親要素（コンテナ）**に `display: flex;` を指定します。
*   **子要素（アイテム）**が自動的に横並びになります。

**HTML**
```html
<div class="flex-container">
  <div class="item">アイテム1</div>
  <div class="item">アイテム2</div>
  <div class="item">アイテム3</div>
</div>
```
**CSS**
```css
.flex-container {
  display: flex; /* これで子要素が横並びになる */
  justify-content: space-around; /* 水平方向の配置（均等に間隔を空ける） */
  align-items: center; /* 垂直方向の配置（中央揃え） */
  height: 100px;
  background-color: skyblue;
}
.item {
  background-color: steelblue;
  color: white;
  padding: 10px;
}
```

##### CSS Grid（グリッドレイアウト）

**二次元（縦横の格子状）のレイアウト**を構築するのに非常に強力です。ウェブサイト全体のレイアウト作成に最適です。

*   **親要素（コンテナ）**に `display: grid;` を指定します。
*   `grid-template-columns` や `grid-template-rows` でグリッドの構造を定義します。

**HTML**
```html
<div class="grid-container">
  <div class="header">ヘッダー</div>
  <div class="sidebar">サイドバー</div>
  <div class="main">メインコンテンツ</div>
  <div class="footer">フッター</div>
</div>
```
**CSS**
```css
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr; /* 1列目は200px、2列目は残り全部 */
  grid-template-rows: auto 1fr auto; /* 行の高さを自動調整 */
  gap: 10px; /* グリッド間の隙間 */
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
}
/* 各エリアに要素を割り当てる */
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

---

#### 8. レスポンシブWebデザイン

PC、タブレット、スマートフォンなど、**異なる画面サイズに応じてレイアウトを最適化**する手法です。中心的な技術は**メディアクエリ**です。

##### メディアクエリ

`@media`ルールを使い、特定の条件（例：画面幅が768px以下の場合）のときにだけ適用するスタイルを記述します。

```css
/* 基本のスタイル（PC向け） */
.container {
  width: 960px;
  margin: 0 auto;
}

/* 画面幅が768px以下の場合（タブレット向け） */
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 20px;
  }
}

/* 画面幅が480px以下の場合（スマホ向け） */
@media (max-width: 480px) {
  .flex-container {
    flex-direction: column; /* Flexboxの並びを縦にする */
  }
}
```

##### ビューポートの設定

レスポンシブデザインを正しく機能させるには、HTMLの`<head>`内に以下の`<meta>`タグを必ず記述します。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
これは、ページの幅をデバイスの画面幅に合わせ、初期のズーム倍率を1.0に設定するという意味です。

---

#### 9. CSSの応用・発展

##### CSS変数（カスタムプロパティ）

色やフォントサイズなどの値を**変数として定義**し、再利用できます。サイト全体で使う色を一括で変更したいときなどに非常に便利です。

```css
:root {
  --main-color: #3498db; /* 変数を定義 */
  --base-font-size: 16px;
}

body {
  font-size: var(--base-font-size); /* 変数を使用 */
}

a {
  color: var(--main-color);
}
```

##### トランジションとアニメーション

*   **`transition`**: プロパティの値が変化するときに、**滑らかな変化（アニメーション）**を加えます。
    ```css
    .button {
      background-color: #3498db;
      transition: background-color 0.3s ease; /* 0.3秒かけて変化 */
    }
    .button:hover {
      background-color: #2980b9;
    }
    ```
*   **`animation`と`@keyframes`**: より複雑なアニメーションを作成します。
    ```css
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .box {
      animation: fadeIn 2s ease-in-out;
    }
    ```

