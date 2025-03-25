# Coffee Words アプリケーションテストドキュメント

このドキュメントでは、Coffee Words アプリケーションのテスト方法と実装されたテストケースについて説明します。

## テスト環境のセットアップ

Coffee Wordsは、Jestとts-jestを使用してテストを実行します。テスト環境をセットアップするには、以下の手順に従ってください：

1. 必要なパッケージをインストールする：
```bash
npm install --save-dev jest ts-jest @types/jest @testing-library/react-native
```

2. 開発環境でモックを適切に動作させるために、TypeScriptの設定を確認する：
```bash
# tsconfig.jsonに以下の設定が含まれていることを確認
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "jsx": "react-native",
    // その他の設定...
  }
}
```

## テストの実行方法

テストを実行するには、以下のコマンドを使用します：

```bash
# すべてのテストを実行
npm test

# 特定のディレクトリのテストを実行
npx jest __tests__/services/

# 特定のテストファイルを実行
npx jest __tests__/services/openai.buildPrompt.test.ts

# テストを監視モードで実行（変更があると自動的に再実行）
npm run test:watch
```

## 実装されたテストケース

### 言語化機能のテスト

OpenAI API統合とそのフォールバック機能をテストする一連のテストが実装されています。

#### 1. プロンプト構築のテスト (`openai.buildPrompt.test.ts`)

- 完全なレスポンスデータからプロンプトを正しく構築できるか
- 不完全なレスポンスデータから適切なプロンプトが構築されるか
- 空のレスポンスデータからもプロンプトを構築できるか
- 未知のフレーバーが存在する場合でも適切に処理できるか
- 出力形式として正しいJSONフォーマットが指定されているか

#### 2. API レスポンス解析のテスト (`openai.parseResponse.test.ts`)

- 正常なAPIレスポンスを適切に解析できるか
- 不完全なAPIレスポンスをデフォルト値で補完できるか
- 不正なJSONフォーマットの場合にエラー処理できるか

#### 3. エラーハンドリングのテスト (`openai.errorHandling.test.ts`)

- APIキーが設定されていない場合にフォールバック機能を使用するか
- APIレスポンスがokでない場合に適切にエラーをスローするか
- ネットワークエラーが発生した場合に適切にエラーをスローするか

#### 4. フォールバック機能のテスト (`openai.fallback.test.ts`)

- APIエラー発生時にフォールバックが有効な場合はモックデータを返すか
- APIエラー発生時にフォールバックが無効な場合はエラーをスローするか
- タイムアウト発生時にフォールバックが有効な場合はモックデータを返すか
- JSON解析エラー発生時にフォールバックが有効な場合はモックデータを返すか
- APIキーがない場合にフォールバックが有効な場合はモックデータを返すか
- ネットワークエラー発生時にフォールバックが有効な場合はモックデータを返すか

#### 5. APIキー管理のテスト (`openai.apiKey.test.ts`)

- APIキーを正常に保存できるか
- APIキーの保存に失敗した場合にエラーをスローするか
- 環境変数のAPIキーが設定されている場合にそれを返すか
- 環境変数のAPIキーがなければSecureStoreから取得するか
- APIキーが存在する場合にhasApiKeyはtrueを返すか
- APIキーが存在しない場合にhasApiKeyはfalseを返すか
- APIキーが空文字の場合にhasApiKeyはfalseを返すか
- APIキーを正常に削除できるか
- APIキーの削除に失敗した場合にエラーをスローするか

#### 6. 統合テスト (`openai.integration.test.ts`)

- 完全なフロー（APIキー設定 → 言語化 → 解析）が正常に動作するか
- エラー発生時のフォールバックフローが適切に機能するか
- APIキーなしで直接モックデータを使用できるか

## モックの実装

テストでは、以下のモジュールがモック化されています：

- `expo-secure-store`: SecureStore APIをモック
- `@env`: 環境変数（OPENAI_API_KEY）をモック
- `fetch`: グローバルfetch APIをモック
- `react-native`: Platform.OSなどをモック

## テストの拡張方法

新しいテストを追加するには、以下の手順に従ってください：

1. `__tests__`ディレクトリ内に適切なサブディレクトリを作成（ない場合）
2. `{機能名}.test.ts`または`{機能名}.test.tsx`という命名規則でテストファイルを作成
3. 必要なモジュールをインポートし、テストケースを実装
4. `npm test`コマンドでテストを実行

## テストカバレッジ

テストカバレッジレポートを生成するには、以下のコマンドを実行します：

```bash
npx jest --coverage
```

これにより、`coverage`ディレクトリにHTMLレポートが生成されます。