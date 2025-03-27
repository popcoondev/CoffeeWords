declare module '@env' {
  // OpenAI関連
  export const OPENAI_API_KEY: string;
  
  // Firebase関連
  export const FIREBASE_API_KEY: string;
  export const FIREBASE_AUTH_DOMAIN: string;
  export const FIREBASE_PROJECT_ID: string;
  export const FIREBASE_STORAGE_BUCKET: string;
  export const FIREBASE_MESSAGING_SENDER_ID: string;
  export const FIREBASE_APP_ID: string;
  export const FIREBASE_MEASUREMENT_ID: string;
  
  // アプリケーション設定
  export const FIREBASE_MODE: 'mock' | 'production'; // Firebase認証モード
}

// グローバル変数の型定義
declare global {
  // Firebase関連グローバル変数
  var __FIREBASE_MODE__: 'mock' | 'production' | undefined;
  var __FIREBASE_MOCK_MODE__: boolean;
  var __FIREBASE_REAL_MODE__: boolean;
}