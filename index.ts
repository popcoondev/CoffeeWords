import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';

// React Navigation の準備を整える
enableScreens();

// Firebaseモードのデフォルト値を設定
// これは firebase.ts がインポートされる前に実行される必要がある
if (__DEV__) {
  // 開発環境ではデフォルトでモックモード
  (global as any).__FIREBASE_MODE__ = 'mock';
  (global as any).__FIREBASE_MOCK_MODE__ = true;
  (global as any).__FIREBASE_REAL_MODE__ = false;
  console.log('Firebase Mock Mode enabled by default in development');
} else {
  // 本番環境ではデフォルトで本番モード
  (global as any).__FIREBASE_MODE__ = 'production';
  (global as any).__FIREBASE_MOCK_MODE__ = false;
  (global as any).__FIREBASE_REAL_MODE__ = true;
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
