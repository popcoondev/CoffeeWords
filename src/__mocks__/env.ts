// .envファイルのモック
// 実際のプロセス環境変数があればそれを使用し、なければ空文字または指定値を返す
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
export const ENABLE_API_TESTS = process.env.ENABLE_API_TESTS || 'false';

// Firebase設定のモック値 - テスト環境用
export const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'test-api-key';
export const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || 'test-project.firebaseapp.com';
export const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'test-project';
export const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || 'test-project.appspot.com';
export const FIREBASE_MESSAGING_SENDER_ID = process.env.FIREBASE_MESSAGING_SENDER_ID || '123456789';
export const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || '1:123456789:web:abcdef123456';
export const FIREBASE_MEASUREMENT_ID = process.env.FIREBASE_MEASUREMENT_ID || 'G-TEST12345';