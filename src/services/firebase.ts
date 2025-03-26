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
  console.error(
    'Firebase設定が不完全です。環境変数が正しく設定されているか確認してください。\n' +
    '詳細: https://firebase.google.com/docs/web/setup'
  );
  // 開発環境の場合はダミー値を設定してクラッシュを防止
  if (__DEV__) {
    console.warn('開発環境でのみ、ダミーの設定値を使用してアプリ起動を続行します');
    if (!firebaseConfig.apiKey) firebaseConfig.apiKey = 'DUMMY_API_KEY_FOR_DEV';
    if (!firebaseConfig.authDomain) firebaseConfig.authDomain = 'dummy-app.firebaseapp.com';
    if (!firebaseConfig.projectId) firebaseConfig.projectId = 'dummy-project-id';
    if (!firebaseConfig.storageBucket) firebaseConfig.storageBucket = 'dummy-app.appspot.com';
    if (!firebaseConfig.messagingSenderId) firebaseConfig.messagingSenderId = '000000000000';
    if (!firebaseConfig.appId) firebaseConfig.appId = '1:000000000000:web:0000000000000000000000';
  }
}

// デバッグ用に設定値をログ出力（※APIキー先頭5文字だけ表示し、安全に）
console.log('Firebase Config Values:');
console.log('API Key:', firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 5)}...` : 'undefined');
console.log('Auth Domain:', firebaseConfig.authDomain || 'undefined');
console.log('Project ID:', firebaseConfig.projectId || 'undefined');
console.log('Storage Bucket:', firebaseConfig.storageBucket || 'undefined');

// Firebaseの初期化
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

// 各サービスのエクスポート
let auth, db, storage, functions;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Firebase Auth initialization error:', error);
  throw error;
}

try {
  db = getFirestore(app);
  console.log('Firebase Firestore initialized successfully');
} catch (error) {
  console.error('Firebase Firestore initialization error:', error);
}

try {
  storage = getStorage(app);
  console.log('Firebase Storage initialized successfully');
} catch (error) {
  console.error('Firebase Storage initialization error:', error);
}

try {
  functions = getFunctions(app);
  console.log('Firebase Functions initialized successfully');
} catch (error) {
  console.error('Firebase Functions initialization error:', error);
}

export { auth, db, storage, functions };

// Analyticsのサポートチェック
let analytics = null;
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(error => console.log('Analytics not supported:', error));

export { analytics };

export default app;