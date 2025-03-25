// グローバルなモックやテスト設定を行う
global.fetch = jest.fn();

// console.errorをモックして不要なエラーメッセージをテスト出力から除外
console.error = jest.fn();

// react-nativeのPlatform.OSをモックする
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios', // またはandroid、テストに合わせて変更
  select: jest.fn(obj => obj.ios), // またはandroid、テストに合わせて変更
}));