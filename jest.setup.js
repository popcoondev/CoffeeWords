// グローバルなモックやテスト設定を行う
global.fetch = jest.fn();

// console.errorをモックして不要なエラーメッセージをテスト出力から除外
console.error = jest.fn();

// 環境変数の設定状況をログに記録
if (process.env.OPENAI_API_KEY) {
  console.log('Using OPENAI_API_KEY from process.env');
  // APIキーがマスクされた形式でログに残す
  const maskedKey = process.env.OPENAI_API_KEY.substring(0, 5) + '...' + 
                    process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4);
  console.log(`API Key: ${maskedKey}`);
} else {
  console.log('No OPENAI_API_KEY found, using mock');
}

// Firebase設定のログ
if (process.env.FIREBASE_API_KEY && process.env.FIREBASE_PROJECT_ID) {
  console.log('Using Firebase configuration from process.env');
  console.log(`Firebase Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
} else {
  console.log('No Firebase configuration found, using mock values');
}

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
jest.mock('native-base', () => ({
  useToast: jest.fn().mockReturnValue({
    show: jest.fn(),
    close: jest.fn(),
    closeAll: jest.fn(),
  }),
  Box: 'Box',
  Button: 'Button',
  Center: 'Center',
  HStack: 'HStack',
  VStack: 'VStack',
  Text: 'Text',
  Input: 'Input',
  Image: 'Image',
  ScrollView: 'ScrollView',
  Heading: 'Heading',
  Pressable: 'Pressable',
  Spinner: 'Spinner',
  Icon: 'Icon',
  Modal: {
    Header: 'Modal.Header',
    Body: 'Modal.Body',
    Footer: 'Modal.Footer',
    Content: 'Modal.Content',
    CloseButton: 'Modal.CloseButton',
  },
  FormControl: {
    Label: 'FormControl.Label',
    ErrorMessage: 'FormControl.ErrorMessage',
    HelperText: 'FormControl.HelperText',
  },
  Divider: 'Divider',
  Card: 'Card',
}));

// @testingを修正
Object.defineProperty(global, 'TextEncoder', {
  value: require('util').TextEncoder,
});
Object.defineProperty(global, 'TextDecoder', {
  value: require('util').TextDecoder,
});

// JSDOMテスト環境の場合はextendに関する設定
if (process.env.TEST_ENV === 'jsdom') {
  try {
    // @testing-library/jest-domの拡張を適用
    require('@testing-library/jest-dom');
  } catch (e) {
    console.log('Jest-DOM extension could not be loaded:', e.message);
  }
}