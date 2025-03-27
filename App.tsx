import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/constants/theme';

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
