import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box, Spinner, Center } from 'native-base';

import { ROUTES } from '../constants/routes';
import { RootStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants/theme';

// ナビゲーター
import MainTabNavigator from './MainTabNavigator';
import CoffeeRecordNavigator from './CoffeeRecordNavigator';

// スクリーン
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import ExperienceLevelScreen from '../screens/Onboarding/ExperienceLevelScreen';
import ApiKeySettingScreen from '../screens/Preference/ApiKeySettingScreen';

// コンポーネント
import LoadingScreen from '../components/LoadingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading, initialized } = useAuth();

  // 初期ルートを決定
  const getInitialRoute = () => {
    if (user) {
      // ユーザーが認証済みの場合
      if (!user.experienceLevel) {
        // 経験レベルが未設定の場合
        return ROUTES.EXPERIENCE_LEVEL;
      }
      return ROUTES.MAIN;
    }
    // 未認証の場合はオンボーディングから開始
    return ROUTES.ONBOARDING;
  };

  // ロード中の場合はローディングスピナーを表示
  if (loading || !initialized) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* オンボーディング */}
        <Stack.Screen 
          name={ROUTES.ONBOARDING} 
          component={OnboardingScreen} 
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen 
          name={ROUTES.EXPERIENCE_LEVEL} 
          component={ExperienceLevelScreen} 
        />
        
        {/* メイン */}
        <Stack.Screen 
          name={ROUTES.MAIN} 
          component={MainTabNavigator} 
          options={{ gestureEnabled: false }}
        />
        
        {/* コーヒー記録フロー */}
        <Stack.Screen 
          name={ROUTES.COFFEE_RECORD_FLOW} 
          component={CoffeeRecordNavigator} 
        />
        
        {/* 設定画面 */}
        <Stack.Screen 
          name={ROUTES.API_KEY_SETTINGS} 
          component={ApiKeySettingScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;