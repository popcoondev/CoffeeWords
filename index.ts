import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';

// React Navigation の準備を整える
enableScreens();

// Firebaseモードのデフォルト値を設定 - 常に本番モード
// これは firebase.ts がインポートされる前に実行される必要がある
console.log('index.ts: Firebase認証モードを本番に強制設定');
(global as any).__FIREBASE_MODE__ = 'production';
(global as any).__FIREBASE_MOCK_MODE__ = false;
(global as any).__FIREBASE_REAL_MODE__ = true;
console.log('Firebase Production Mode enabled for all environments');

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
