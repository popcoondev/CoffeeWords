// expo-secure-storeのモック
const secureStore: Record<string, string> = {};

export const setItemAsync = jest.fn(
  async (key: string, value: string): Promise<void> => {
    secureStore[key] = value;
    return Promise.resolve();
  }
);

export const getItemAsync = jest.fn(
  async (key: string): Promise<string | null> => {
    return Promise.resolve(secureStore[key] || null);
  }
);

export const deleteItemAsync = jest.fn(
  async (key: string): Promise<void> => {
    delete secureStore[key];
    return Promise.resolve();
  }
);

// SecureStoreで発生する可能性のあるエラーをシミュレートするためのヘルパー関数
export const throwErrorOnNextCall = (methodName: string, error: Error): void => {
  const originalMethod = module.exports[methodName];
  module.exports[methodName] = jest.fn().mockRejectedValueOnce(error);
  
  // 元のメソッドに戻すためのクリーンアップ関数を提供
  setTimeout(() => {
    module.exports[methodName] = originalMethod;
  }, 100);
};