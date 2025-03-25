/**
 * テスト用の環境変数をロードするユーティリティ
 * 
 * 以下の優先順位で環境変数を探します：
 * 1. 実行時の環境変数（process.env）
 * 2. .env.testファイル（dotenv経由）
 * 3. SecureStoreに保存された値（実機テスト用）
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';

// .env.testファイルをロード
const envPath = resolve(process.cwd(), '.env.test');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('Loaded environment variables from .env.test');
} else {
  console.log('.env.test file not found. Using default environment variables.');
}

// 環境変数を取得する関数
export const getTestEnv = (key: string, defaultValue: string = ''): string => {
  // 1. 実行時の環境変数から取得
  if (process.env[key]) {
    return process.env[key] || defaultValue;
  }
  
  // 2. デフォルト値を返す
  return defaultValue;
};

// OpenAI APIキーをセキュアに取得
export const getOpenAIApiKey = (): string => {
  return getTestEnv('OPENAI_API_KEY', '');
};

// APIテストを有効にするかどうか
export const isApiTestEnabled = (): boolean => {
  return getTestEnv('ENABLE_API_TESTS', 'false') === 'true';
};