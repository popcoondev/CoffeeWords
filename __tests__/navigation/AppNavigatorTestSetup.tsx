/**
 * AppNavigatorのテスト用セットアップファイル
 * 
 * Firebase認証とホックをモック化して、画面遷移のテストを行うための環境を設定します。
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { useAuth } from '../../src/hooks/useAuth';
import AppNavigator from '../../src/navigation/AppNavigator';

// useAuthフックのモック
jest.mock('../../src/hooks/useAuth');

// コンポーネントのモック
jest.mock('../../src/components/LoadingScreen', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="LoadingScreen">アプリを準備しています...</div>)
  };
});

jest.mock('../../src/screens/Onboarding/OnboardingScreen', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="OnboardingScreen">オンボーディング画面</div>)
  };
});

jest.mock('../../src/screens/Onboarding/ExperienceLevelScreen', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="ExperienceLevelScreen">経験レベル設定画面</div>)
  };
});

jest.mock('../../src/navigation/MainTabNavigator', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="MainTabNavigator">メイン画面</div>)
  };
});

jest.mock('../../src/navigation/CoffeeRecordNavigator', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="CoffeeRecordNavigator">コーヒー記録フロー</div>)
  };
});

jest.mock('../../src/screens/Preference/ApiKeySettingScreen', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid="ApiKeySettingScreen">APIキー設定画面</div>)
  };
});

// NavigationContainerのモック
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    NavigationContainer: ({ children }) => <div data-testid="NavigationContainer">{children}</div>
  };
});

// createNativeStackNavigatorのモック
jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children, initialRouteName }) => (
        <div data-testid="StackNavigator" data-initialroute={initialRouteName}>
          {children}
        </div>
      ),
      Screen: ({ name, component }) => <div data-testid={`Screen-${name}`}>{name}</div>
    })
  };
});

// テスト用の認証状態の設定
export const setupAuthState = (authState: {
  user?: any;
  loading?: boolean;
  initialized?: boolean;
}) => {
  const { 
    user = null, 
    loading = false, 
    initialized = true 
  } = authState;
  
  (useAuth as jest.Mock).mockReturnValue({
    user,
    loading,
    initialized,
    firebaseUser: user ? { uid: user.id } : null,
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    updateUserProfile: jest.fn(),
  });
};

// テスト用のレンダリング関数
export const renderAppNavigator = () => {
  return render(<AppNavigator />);
};

// テスト用のユーザーオブジェクト
export const testUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  createdAt: new Date(),
  experienceLevel: 'beginner'
};

export const testUserWithoutExperienceLevel = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  createdAt: new Date(),
  experienceLevel: undefined
};