import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants/theme';

// 本番モードを強制的に設定
console.log('App.tsx: 認証モードを本番に強制設定');
(global as any).__FIREBASE_MODE__ = 'production';
(global as any).__FIREBASE_MOCK_MODE__ = false;
(global as any).__FIREBASE_REAL_MODE__ = true;

// SSRProviderの警告を抑制するコンフィグ
const config = {
  // SSRを明示的に無効化
  suppressColorAccessibilityWarning: true, 
  useSSR: false
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider config={config} theme={theme}>
        <StatusBar style="dark" />
        <AppNavigator />
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}
