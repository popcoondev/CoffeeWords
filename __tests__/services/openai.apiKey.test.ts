import { 
  saveApiKey, 
  getApiKey, 
  hasApiKey, 
  removeApiKey 
} from '../../src/services/openai';
import * as SecureStore from 'expo-secure-store';

describe('APIキー管理', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // SecureStoreのモックをクリア
    (SecureStore.setItemAsync as jest.Mock).mockClear();
    (SecureStore.getItemAsync as jest.Mock).mockClear();
    (SecureStore.deleteItemAsync as jest.Mock).mockClear();
  });

  it('APIキーを正常に保存できる', async () => {
    await saveApiKey('test-api-key');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('openai_api_key', 'test-api-key');
  });

  it('APIキーの保存に失敗した場合にエラーをスローする', async () => {
    // SecureStoreのsetItemAsyncがエラーをスローするようにモック
    jest.spyOn(SecureStore, 'setItemAsync').mockRejectedValueOnce(new Error('保存エラー'));

    await expect(saveApiKey('test-api-key')).rejects.toThrow('APIキーの保存に失敗しました');
  });

  it('環境変数のAPIキーが設定されている場合にそれを返す', async () => {
    // APIキーをクリア
    await removeApiKey();
    
    // 環境変数の値を直接上書き
    jest.resetModules();
    // env.tsを直接編集
    const fs = require('fs');
    
    // すでに保存されていた内容をバックアップ
    const originalContent = fs.readFileSync('/Users/mn/development/CoffeeWords/src/__mocks__/env.ts', 'utf8');
    
    // 一時的に内容を書き換え
    fs.writeFileSync('/Users/mn/development/CoffeeWords/src/__mocks__/env.ts', 
      '// .envファイルのモック\nexport const OPENAI_API_KEY = \'env-api-key\';');
    
    // モジュールのキャッシュをクリア
    jest.resetModules();
    
    // 再度モジュールをインポート
    const { getApiKey } = require('../../src/services/openai');
    const result = await getApiKey();
    
    // テスト後に環境変数を元に戻す
    fs.writeFileSync('/Users/mn/development/CoffeeWords/src/__mocks__/env.ts', originalContent);
    
    expect(result).toBe('env-api-key');
  });

  it('環境変数のAPIキーがなければSecureStoreから取得する', async () => {
    // APIキーを設定
    await saveApiKey('stored-api-key');
    
    // 環境変数の値をクリア
    jest.resetModules();
    const mockedEnv = require('../../src/__mocks__/env');
    const originalKey = mockedEnv.OPENAI_API_KEY;
    mockedEnv.OPENAI_API_KEY = '';
    
    const result = await getApiKey();
    
    // テスト後に環境変数を元に戻す
    mockedEnv.OPENAI_API_KEY = originalKey;
    
    expect(result).toBe('stored-api-key');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('openai_api_key');
  });

  it('APIキーが存在する場合にhasApiKeyはtrueを返す', async () => {
    await saveApiKey('test-api-key');
    const result = await hasApiKey();
    expect(result).toBe(true);
  });

  it('APIキーが存在しない場合にhasApiKeyはfalseを返す', async () => {
    // SecureStoreのgetItemAsyncがnullを返すようにモック
    jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValueOnce(null);
    
    // 環境変数の値をクリア
    jest.resetModules();
    const mockedEnv = require('../../src/__mocks__/env');
    const originalKey = mockedEnv.OPENAI_API_KEY;
    mockedEnv.OPENAI_API_KEY = '';
    
    const result = await hasApiKey();
    
    // テスト後に環境変数を元に戻す
    mockedEnv.OPENAI_API_KEY = originalKey;
    
    expect(result).toBe(false);
  });

  it('APIキーが空文字の場合にhasApiKeyはfalseを返す', async () => {
    await saveApiKey('');
    const result = await hasApiKey();
    expect(result).toBe(false);
  });

  it('APIキーを正常に削除できる', async () => {
    await saveApiKey('test-api-key');
    await removeApiKey();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('openai_api_key');
    
    // 削除後にキーが存在しないことを確認
    const exists = await hasApiKey();
    expect(exists).toBe(false);
  });

  it('APIキーの削除に失敗した場合にエラーをスローする', async () => {
    // SecureStoreのdeleteItemAsyncがエラーをスローするようにモック
    jest.spyOn(SecureStore, 'deleteItemAsync').mockRejectedValueOnce(new Error('削除エラー'));

    await expect(removeApiKey()).rejects.toThrow('APIキーの削除に失敗しました');
  });
});