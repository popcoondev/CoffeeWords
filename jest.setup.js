// グローバルなモックやテスト設定を行う
global.fetch = jest.fn();

// console.errorをモックして不要なエラーメッセージをテスト出力から除外
console.error = jest.fn();

// react-nativeのPlatform.OSをモックする
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios', // またはandroid、テストに合わせて変更
  select: jest.fn(obj => obj.ios), // またはandroid、テストに合わせて変更
}));

// React NativeのAnimated APIをモック
jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  reactNative.Animated.timing = () => ({
    start: jest.fn(cb => cb && cb({ finished: true })),
  });
  reactNative.Animated.spring = () => ({
    start: jest.fn(cb => cb && cb({ finished: true })),
  });
  return reactNative;
});

// React Navigation Hooksモック
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn().mockReturnValue({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      dispatch: jest.fn(),
      reset: jest.fn(),
      canGoBack: jest.fn().mockReturnValue(true),
    }),
    useRoute: jest.fn().mockReturnValue({
      params: {},
    }),
    useIsFocused: jest.fn().mockReturnValue(true),
  };
});

// Native Baseのモック
jest.mock('native-base', () => {
  const actualNB = jest.requireActual('native-base');
  return {
    ...actualNB,
    useToast: jest.fn().mockReturnValue({
      show: jest.fn(),
      close: jest.fn(),
      closeAll: jest.fn(),
    }),
  };
});

// @testingを修正
Object.defineProperty(global, 'TextEncoder', {
  value: require('util').TextEncoder,
});
Object.defineProperty(global, 'TextDecoder', {
  value: require('util').TextDecoder,
});