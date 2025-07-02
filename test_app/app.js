class UserManager {
    constructor(listElementId) {
        this.users = [];
        this.userListElement = document.getElementById(listElementId);
    }
    
    async addUser(userData) {
        try {
            // 1. データの検証 (エラーハンドリング)
            this.validateUserData(userData);
            
            // 2. ユーザーオブジェクトの作成 (オブジェクト)
            const user = {
                id: Date.now(),
                ...userData, // スプレッド構文でプロパティを展開
                createdAt: new Date()
            };
            
            // 3. サーバーに保存 (非同期処理のシミュレーション)
            await this.saveToServer(user);
            
            // 4. ローカルの配列にデータを追加 (データ処理)
            this.users.push(user);
            
            // 5. UIを更新 (DOM操作)
            this.updateUserList();
            
            return user;
        } catch (error) {
            console.error('ユーザー追加エラー:', error.message);
            throw error; // エラーを呼び出し元に再度投げる
        }
    }
    
    validateUserData(userData) {
        if (!userData.name || userData.name.trim().length < 2) {
            throw new Error('名前は2文字以上で入力してください');
        }
    }
    
    // サーバーへの保存を模倣する非同期関数
    saveToServer(user) {
        console.log(`${user.name}をサーバーに保存中...`);
        return new Promise((resolve, reject) => {
            // 意図的に失敗するケースも作る
            if (user.name.toLowerCase() === 'error') {
                 setTimeout(() => reject(new Error('サーバー側でエラーが発生しました。')), 1000);
            } else {
                 setTimeout(() => {
                    console.log('保存完了');
                    resolve({ success: true });
                }, 1000);
            }
        });
    }
    
    // ユーザーリストのHTMLを更新
    updateUserList() {
        this.userListElement.innerHTML = this.users
            .map(user => `<li>${user.name} (ID: ${user.id})</li>`)
            .join('');
    }
}

// --- アプリケーションの実行部分 ---
const userManager = new UserManager('userList');
const nameInput = document.getElementById('nameInput');
const addUserButton = document.getElementById('addUserButton');

// ボタンクリック時のイベントリスナー (制御構造 + 非同期処理)
addUserButton.addEventListener('click', async () => {
    const name = nameInput.value;
    
    try {
        await userManager.addUser({ name });
        alert('ユーザーが正常に追加されました');
        nameInput.value = ''; // 入力欄をクリア
    } catch (error) {
        alert(`エラー: ${error.message}`);
    }
});
