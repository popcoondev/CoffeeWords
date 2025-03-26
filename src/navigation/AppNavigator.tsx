import React, { useEffect, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box, Spinner, Center } from 'native-base';
import { Text, Alert, Platform } from 'react-native';

import { ROUTES } from '../constants/routes';
import { RootStackParamList } from '../types';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants/theme';

// ナビゲーター
import MainTabNavigator from './MainTabNavigator';

// スクリーン
// 認証関連
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import ExperienceLevelScreen from '../screens/Onboarding/ExperienceLevelScreen';
import LoginScreen from '../screens/Onboarding/LoginScreen';
import SignupScreen from '../screens/Onboarding/SignupScreen';

// 探検フロー
import ExplorationInfoScreen from '../screens/Exploration/ExplorationInfoScreen';
import ExplorationTasteMapScreen from '../screens/Exploration/ExplorationTasteMapScreen';
import ExplorationPreferencesScreen from '../screens/Exploration/ExplorationPreferencesScreen';
import ExplorationComparisonScreen from '../screens/Exploration/ExplorationComparisonScreen';
import ExplorationResultScreen from '../screens/Exploration/ExplorationResultScreen';

// 翻訳辞書
import TranslationDictionaryScreen from '../screens/Translation/TranslationDictionaryScreen';
// import TermDetailScreen from '../screens/Translation/TermDetailScreen';
// import TermEditScreen from '../screens/Translation/TermEditScreen';
// import TranslationToolScreen from '../screens/Translation/TranslationToolScreen';

// 味わい探検マップ
import TasteMapScreen from '../screens/TasteMap/TasteMapScreen';
// import TasteMapDetailScreen from '../screens/TasteMap/TasteMapDetailScreen';
// import PreferenceProfileScreen from '../screens/TasteMap/PreferenceProfileScreen';
// import RecommendationsScreen from '../screens/TasteMap/RecommendationsScreen';
// import ExplorationHistoryScreen from '../screens/TasteMap/ExplorationHistoryScreen';

// ミッション
// import MissionsScreen from '../screens/Missions/MissionsScreen';
// import MissionDetailScreen from '../screens/Missions/MissionDetailScreen';

// 設定
import ApiKeySettingScreen from '../screens/Preference/ApiKeySettingScreen';

// コンポーネント
import LoadingScreen from '../components/LoadingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  // すべてのhooksは条件分岐よりも前に宣言する
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const { user, loading, initialized, error } = useAuth();

  // useEffectもここで宣言しておく
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigationRef.current) {
        const state = navigationRef.current.getRootState();
        console.log('5秒後のナビゲーション状態:', JSON.stringify(state));
        
        const currentRoute = navigationRef.current.getCurrentRoute();
        console.log('現在のルート:', currentRoute?.name);
        
        // デバッグ用アラート
        if (__DEV__) {
          Alert.alert(
            'ナビゲーション状態', 
            `現在のルート: ${currentRoute?.name || 'なし'}\n` +
            `プラットフォーム: ${Platform.OS}`
          );
        }
      } else {
        console.log('navigationRefが利用できません');
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  console.log('AppNavigator: レンダリング開始', { loading, initialized, hasUser: !!user, hasError: !!error });

  // 初期ルートを決定
  const getInitialRoute = () => {
    if (user) {
      // ユーザーが認証済みの場合
      if (!user.experienceLevel) {
        // 経験レベルが未設定の場合
        console.log('AppNavigator: 経験レベル未設定ユーザー、ExperienceLevelScreenへ遷移');
        return ROUTES.EXPERIENCE_LEVEL;
      }
      console.log('AppNavigator: 認証済みユーザー、MAINへ遷移');
      return ROUTES.MAIN;
    }
    // 未認証の場合はオンボーディングから開始
    console.log('AppNavigator: 未認証ユーザー、Onboardingへ遷移');
    return ROUTES.ONBOARDING;
  };

  // Firebase設定エラーを検出
  if (error && error.includes('Firebase')) {
    return (
      <LoadingScreen 
        message={'Firebaseの設定エラーが発生しました: ' + error} 
        showDebug={true}
      />
    );
  }

  // ロード中の場合はローディングスピナーを表示
  if (loading || !initialized) {
    console.log('AppNavigator: ロード中またはinitialize中、ローディング画面を表示');
    return <LoadingScreen message={`${loading ? 'ロード中' : ''}${!initialized ? '初期化中' : ''}`} showDebug={true} />;
  }

  // 初期ルートを取得
  const initialRoute = getInitialRoute();
  console.log('Navigation初期ルート:', initialRoute);


  try {
    return (
      <NavigationContainer
        ref={navigationRef}
        onStateChange={(state) => {
          console.log('Navigation状態変更:', 
            state?.routes[state.index]?.name || 'unknown',
            'index:', state?.index || 'unknown'
          );
        }}
        onReady={() => {
          console.log('NavigationContainer準備完了');
          const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
          console.log('初期ルート:', currentRouteName);
        }}
      >
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {/* 認証関連 */}
          <Stack.Screen 
            name={ROUTES.ONBOARDING} 
            component={OnboardingScreen} 
            options={{ gestureEnabled: false }}
            listeners={{ focus: () => console.log('OnboardingScreen FOCUSED') }}
          />
          <Stack.Screen 
            name={ROUTES.LOGIN} 
            component={LoginScreen} 
            options={{ gestureEnabled: true }}
            listeners={{ focus: () => console.log('LoginScreen FOCUSED') }}
          />
          <Stack.Screen 
            name={ROUTES.SIGNUP} 
            component={SignupScreen} 
            options={{ gestureEnabled: true }}
            listeners={{ focus: () => console.log('SignupScreen FOCUSED') }}
          />
          <Stack.Screen 
            name={ROUTES.EXPERIENCE_LEVEL} 
            component={ExperienceLevelScreen} 
            listeners={{ focus: () => console.log('ExperienceLevelScreen FOCUSED') }}
          />
          
          {/* メイン */}
          <Stack.Screen 
            name={ROUTES.MAIN} 
            component={MainTabNavigator} 
            options={{ gestureEnabled: false }}
            listeners={{ focus: () => console.log('MainTabNavigator FOCUSED') }}
          />
          
          {/* 探検フロー */}
          <Stack.Screen 
            name={ROUTES.EXPLORATION_FLOW} 
            component={ExplorationInfoScreen} 
            listeners={{ focus: () => console.log('ExplorationInfoScreen FOCUSED') }}
          />
          <Stack.Screen 
            name={ROUTES.EXPLORATION_TASTE_MAP} 
            component={ExplorationTasteMapScreen} 
            listeners={{ focus: () => console.log('ExplorationTasteMapScreen FOCUSED') }}
          />
          <Stack.Screen 
            name={ROUTES.EXPLORATION_PREFERENCES} 
            component={ExplorationPreferencesScreen} 
            listeners={{ focus: () => console.log('ExplorationPreferencesScreen FOCUSED') }}
          />
          <Stack.Screen 
            name={ROUTES.EXPLORATION_COMPARISON} 
            component={ExplorationComparisonScreen} 
            listeners={{ focus: () => console.log('ExplorationComparisonScreen FOCUSED') }}
          />
          <Stack.Screen 
            name={ROUTES.EXPLORATION_RESULT} 
            component={ExplorationResultScreen} 
            listeners={{ focus: () => console.log('ExplorationResultScreen FOCUSED') }}
          />
          
          {/* 設定画面 */}
          <Stack.Screen 
            name={ROUTES.API_KEY_SETTINGS} 
            component={ApiKeySettingScreen} 
            listeners={{ focus: () => console.log('ApiKeySettingScreen FOCUSED') }}
          />
          
          {/* 後方互換性のための旧ルート */}
          <Stack.Screen 
            name={ROUTES.COFFEE_RECORD_FLOW} 
            component={ExplorationInfoScreen} 
            listeners={{ focus: () => console.log('旧CoffeeRecordFlow FOCUSED -> ExplorationInfoScreen') }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    console.error('NavigationContainer初期化エラー:', error);
    return (
      <LoadingScreen 
        message={`ナビゲーション初期化エラー: ${error instanceof Error ? error.message : String(error)}`}
        showDebug={true}
      />
    );
  }
};

export default AppNavigator;