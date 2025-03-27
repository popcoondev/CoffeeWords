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

// @ts-ignore - 型エラーを無視（React Navigation v7との互換性のため）
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // すべてのhooksは条件分岐よりも前に宣言する
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const { user, loading, initialized, error } = useAuth();
  const initialRouteRef = useRef<string | null>(null);
  const hasSetInitialRouteRef = useRef<boolean>(false);

  // 初期ルートを決定する関数
  const determineInitialRoute = () => {
    // 初期ルートが既に設定されている場合はそれを返す
    if (hasSetInitialRouteRef.current && initialRouteRef.current) {
      return initialRouteRef.current;
    }

    if (!loading && initialized) {
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
    }
    return null;
  };

  // ルートが決定されたかを追跡する参照
  const routeDeterminedRef = useRef(false);
  
  // 初回マウント時のみ実行される初期設定
  useEffect(() => {
    console.log('AppNavigator: 初期マウント');
    
    // ルート決定関数をナビゲーションレディ時のコールバックとして設定
    const onReady = () => {
      if (!hasSetInitialRouteRef.current) {
        const route = determineInitialRoute();
        if (route) {
          initialRouteRef.current = route;
          hasSetInitialRouteRef.current = true;
          console.log('NavigationContainer準備完了時の初期ルート:', route);
        }
      }
    };
    
    // navigationRefが利用可能になったら設定
    if (navigationRef.current) {
      onReady();
    }
    
    return () => {
      console.log('AppNavigator: アンマウント');
    };
  }, []);
  
  // ユーザー状態変更時の処理（ログ記録のみ）
  useEffect(() => {
    if (!loading && initialized) {
      console.log('認証状態更新:', {
        user: user?.id || 'なし', 
        experienceLevel: user?.experienceLevel || 'なし',
        initialRoute: initialRouteRef.current
      });
    }
  }, [loading, initialized, user]);

  console.log('AppNavigator: レンダリング開始', { 
    loading, 
    initialized, 
    hasUser: !!user, 
    hasError: !!error, 
    initialRoute: initialRouteRef.current 
  });

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

  // 初期ルートが設定されていない場合はデフォルトを使用
  const initialRoute = initialRouteRef.current || ROUTES.ONBOARDING;


  try {
    return (
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          // NavigationContainerの準備完了時の処理
          console.log('NavigationContainer: 準備完了');
          if (!hasSetInitialRouteRef.current) {
            const route = determineInitialRoute();
            if (route) {
              initialRouteRef.current = route;
              hasSetInitialRouteRef.current = true;
              console.log('NavigationContainer準備完了時の初期ルート設定:', route);
            }
          }
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
          />
          <Stack.Screen 
            name={ROUTES.LOGIN} 
            component={LoginScreen} 
            options={{ gestureEnabled: true }}
          />
          <Stack.Screen 
            name={ROUTES.SIGNUP} 
            component={SignupScreen} 
            options={{ gestureEnabled: true }}
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
          
          {/* 探検フロー */}
          <Stack.Screen 
            name={ROUTES.EXPLORATION_FLOW} 
            component={ExplorationInfoScreen} 
          />
          <Stack.Screen 
            name={ROUTES.EXPLORATION_TASTE_MAP} 
            component={ExplorationTasteMapScreen} 
          />
          <Stack.Screen 
            name={ROUTES.EXPLORATION_PREFERENCES} 
            component={ExplorationPreferencesScreen} 
          />
          <Stack.Screen 
            name={ROUTES.EXPLORATION_COMPARISON} 
            component={ExplorationComparisonScreen} 
          />
          <Stack.Screen 
            name={ROUTES.EXPLORATION_RESULT} 
            component={ExplorationResultScreen} 
          />
          
          {/* 設定画面 */}
          <Stack.Screen 
            name={ROUTES.API_KEY_SETTINGS} 
            component={ApiKeySettingScreen} 
          />
          
          {/* 後方互換性のための旧ルート */}
          <Stack.Screen 
            name={ROUTES.COFFEE_RECORD_FLOW} 
            component={ExplorationInfoScreen} 
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