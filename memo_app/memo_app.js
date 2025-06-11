// 必要な要素を取得
const form = document.querySelector('#add-form');
const input = document.querySelector('#add-input');
const taskList = document.querySelector('#task-list');

// フォームが送信されたときの処理
form.addEventListener('submit', (event) => {
  // フォームのデフォルトの送信動作（ページリロード）をキャンセル
  event.preventDefault();

  // 入力されたテキストを取得（前後の空白は削除）
  const taskText = input.value.trim();

  // テキストが空でなければタスクを追加
  if (taskText !== '') {
    addTask(taskText);
    // 入力欄を空にする
    input.value = '';
    // 入力欄にフォーカスを戻す
    input.focus();
  }
});

// タスクを追加する関数
function addTask(text) {
  // li要素を作成
  const li = document.createElement('li');

  // span要素を作成してテキストを設定
  const span = document.createElement('span');
  span.textContent = text;

  // 削除ボタンを作成
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '削除';
  
  // li要素にspanと削除ボタンを追加
  li.appendChild(span);
  li.appendChild(deleteButton);

  // ul要素にli要素を追加
  taskList.appendChild(li);
}
