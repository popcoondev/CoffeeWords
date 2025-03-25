import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics, isSupported } from 'firebase/analytics';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// environment variables (from react-native-dotenv)
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from '@env';

// Firebase設定
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// 設定値が存在するかチェック (少なくともapiKeyとprojectIdは必須)
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn(
    'Firebase設定が不完全です。環境変数が正しく設定されているか確認してください。\n' +
    '詳細: https://firebase.google.com/docs/web/setup'
  );
}

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// 各サービスのエクスポート
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Analyticsのサポートチェック
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(error => console.log('Analytics not supported:', error));

export { analytics };

export default app;