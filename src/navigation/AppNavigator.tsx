import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '../constants/routes';
import { RootStackParamList } from '../types';

// ナビゲーター
import MainTabNavigator from './MainTabNavigator';
import CoffeeRecordNavigator from './CoffeeRecordNavigator';

// スクリーン
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import ExperienceLevelScreen from '../screens/Onboarding/ExperienceLevelScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // 認証状態は後で実装
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isAuthenticated ? ROUTES.MAIN : ROUTES.ONBOARDING}
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* オンボーディング */}
        <Stack.Screen name={ROUTES.ONBOARDING} component={OnboardingScreen} />
        <Stack.Screen name={ROUTES.EXPERIENCE_LEVEL} component={ExperienceLevelScreen} />
        
        {/* メイン */}
        <Stack.Screen name={ROUTES.MAIN} component={MainTabNavigator} />
        
        {/* コーヒー記録フロー */}
        <Stack.Screen name={ROUTES.COFFEE_RECORD_FLOW} component={CoffeeRecordNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;