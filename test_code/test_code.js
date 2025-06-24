function findMax(numbers) {
  let max = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) {
      max = numbers[i];
    }
  }
  return max; // 最大値を返す
}

console.log(findMax([3, 7, 2, 9, 1])); // 9




//querySelectorAll(cssSelector) (推奨): CSSセレクタを使って、条件に一致する要素をすべて取得します。戻り値はNodeListという、配列に似たオブジェクトです。

const allParagraphs = document.querySelectorAll('p');
// NodeListはforEachが使えるので便利
allParagraphs.forEach(p => {
  console.log(p);
});