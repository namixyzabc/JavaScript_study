
// script.js

// DOMContentLoadedイベントリスナーを追加し、HTMLの読み込みと解析が完了した後に実行されるようにします。
// これにより、スクリプトが<body>の最後や<head>内にあっても、要素を確実に見つけることができます。
document.addEventListener('DOMContentLoaded', function () {
    // モバイルメニューボタンの要素を取得
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    // モバイルメニュー本体の要素を取得
    const mobileMenu = document.getElementById('mobile-menu');

    // モバイルメニューボタンが存在する場合のみ、イベントリスナーを設定
    if (mobileMenuButton && mobileMenu) {
        // モバイルメニューボタンがクリックされたときの処理
        mobileMenuButton.addEventListener('click', function () {
            // モバイルメニューの表示/非表示を切り替える
            // classList.toggle('hidden') は 'hidden' クラスが存在すれば削除し、存在しなければ追加します。
            mobileMenu.classList.toggle('hidden');

            // ARIA属性を更新して、メニューの開閉状態をスクリーンリーダーに伝える
            // getAttributeで現在の状態を取得し、'true'なら'false'に、そうでなければ'true'に設定
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);

            // ボタンのアイコンを変更する (オプション)
            // 例えば、開いているときは「閉じる」アイコン、閉じているときは「メニュー」アイコンに
            // このサンプルではSVGアイコンのパスを直接操作していませんが、必要に応じて変更できます。
            // 簡単な例として、ボタンのテキストを変更することも考えられます。
            // if (!isExpanded) {
            //     mobileMenuButton.innerHTML = `<svg>...</svg>`; // 閉じるアイコン
            // } else {
            //     mobileMenuButton.innerHTML = `<svg>...</svg>`; // メニューアイコン
            // }
        });
    }

    // 学習用コメント:
    // このファイルは、ウェブサイトにインタラクティブな機能を追加するために使用されます。
    // 今回は、モバイルデバイスで表示されるハンバーガーメニューの開閉機能のみを実装しています。
    // 
    // 他にもJavaScriptでできることの例:
    // - フォームの入力検証 (例: メールアドレスの形式が正しいかチェックする)
    // - スムーズスクロール (ページ内リンクをクリックしたときに滑らかに移動する)
    // - 画像スライダーやカルーセル
    // - APIからデータを取得して表示する (非同期通信)
    // - ユーザーのアクションに応じて動的にコンテンツを変更する
    //
    // 良いJavaScriptコードを書くためのポイント:
    // 1. わかりやすい変数名、関数名を使う。
    // 2. コメントを適切に追加して、コードの意図を説明する。
    // 3. DRY (Don't Repeat Yourself) 原則を意識し、繰り返し同じコードを書かないようにする。
    // 4. エラーハンドリングを考慮する (今回は簡略化のため省略)。
    // 5. パフォーマンスに影響するような重い処理は避けるか、最適化する。
    //
    // このサイトは静的なので、複雑なJavaScriptは不要ですが、
    // より動的なウェブアプリケーションを作成する際には、JavaScriptの役割が非常に大きくなります。
});
