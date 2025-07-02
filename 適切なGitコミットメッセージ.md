# Gitコミットメッセージのベストプラクティス

## 基本的な構造

```
<タイプ>: <要約>（50文字以内）

<詳細な説明>（必要に応じて）
```

## コミットタイプ

| タイプ | 説明 | 例 |
|-------|------|-----|
| `feat` | 新機能の追加 | `feat: ユーザー登録機能を追加` |
| `fix` | バグ修正 | `fix: ログイン時のエラーハンドリングを修正` |
| `docs` | ドキュメントの変更 | `docs: READMEにセットアップ手順を追加` |
| `style` | コードフォーマット、セミコロンなど | `style: インデントを統一` |
| `refactor` | リファクタリング | `refactor: ユーザー認証ロジックを整理` |
| `test` | テストの追加・修正 | `test: ユーザー登録のテストケースを追加` |
| `chore` | ビルド、設定ファイルなど | `chore: package.jsonの依存関係を更新` |

## 良いコミットメッセージの例

```bash
feat: ユーザープロフィール編集機能を追加
fix: 商品検索で特殊文字が含まれる場合のエラーを修正
docs: API仕様書にエラーレスポンスの詳細を追加
refactor: データベース接続処理を共通化
```

## 避けるべきコミットメッセージ

```bash
fix bug
update
WIP
あれこれ修正
Changed some files
```

## コミットメッセージのルール

### 要約行（1行目）
- 50文字以内で簡潔に
- 動詞で始める（追加、修正、削除など）
- 句点（。）は不要
- 命令形で書く

### 本文（2行目以降）
- 要約行の後に空行を1行入れる
- なぜその変更が必要だったのかを説明
- 何を変更したのかよりもなぜ変更したのかに焦点

### 日本語 vs 英語
```bash
# 日本語の場合
feat: ユーザー認証機能を追加

# 英語の場合
feat: add user authentication feature
```

## 実践的なコツ

### 一つのコミットに一つの変更
```bash
# 良い例
feat: ユーザー登録機能を追加
fix: パスワード検証のバグを修正

# 悪い例
feat: ユーザー登録機能を追加とバグ修正
```

### 現在形・命令形を使用
```bash
# 良い例
fix: ログインエラーを修正
add: 新しいAPIエンドポイントを追加

# 悪い例
fixed: ログインエラーを修正した
adding: 新しいAPIエンドポイントを追加中
```

### 具体的で分かりやすく
```bash
# 良い例
fix: iPhone Safariでボタンが表示されない問題を修正

# 悪い例
fix: UIの問題を修正
```

## Conventional Commitsの活用

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

例：
```
feat(auth): add OAuth2 login functionality

Implement Google and GitHub OAuth2 integration
- Add OAuth2 configuration
- Create login/logout endpoints
- Update user model

Closes #123
```

## まとめ

- 一貫性：チーム内で統一されたフォーマットを使用
- 簡潔性：要約は50文字以内、分かりやすく
- 明確性：変更の理由と内容を明確に記述
- 単一責任：一つのコミットに一つの変更
- 現在形：命令形で統一
