// .envファイルのモック
// 実際のプロセス環境変数があればそれを使用し、なければ空文字を返す
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const ENABLE_API_TESTS = process.env.ENABLE_API_TESTS || 'false';