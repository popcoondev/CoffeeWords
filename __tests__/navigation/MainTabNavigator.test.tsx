import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MainTabNavigator from '../../src/navigation/MainTabNavigator';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../src/constants/routes';

// React Navigationのモック
jest.mock('@react-navigation/native');
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children, tabBar }: any) => {
      // カスタムタブバーをレンダリングするためにpropsを渡す
      const TabBar = tabBar;
      return (
        <>
          {children}
          <TabBar
            state={{ routes: [
              { key: 'Home', name: 'Home' },
              { key: 'Dictionary', name: 'Dictionary' },
              { key: 'Preference', name: 'Preference' }
            ], index: 0 }}
            descriptors={{
              Home: { options: { title: '今日の一杯' } },
              Dictionary: { options: { title: 'コーヒー辞典' } },
              Preference: { options: { title: 'あなたの好み' } }
            }}
            navigation={{ emit: jest.fn(), navigate: jest.fn() }}
          />
        </>
      );
    },
    Screen: ({ name, component }: any) => null,
  }),
}));

describe('MainTabNavigator', () => {
  // モックの初期化をリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('カスタムタブバーを正しくレンダリング', () => {
    const { getAllByTestId } = render(<MainTabNavigator />);
    
    // Pressableコンポーネント（タブボタン）が3つあることを確認
    const tabButtons = getAllByTestId('Pressable');
    expect(tabButtons.length).toBeGreaterThanOrEqual(3); // FABボタンを含む可能性あり
    
    // FABボタンが存在することを確認
    const fabButton = tabButtons.find(button => 
      button.props.children.some((child: any) => 
        child?.props?.name === 'add'
      )
    );
    expect(fabButton).toBeTruthy();
  });

  it('FABボタンをタップするとコーヒー記録フローに遷移', () => {
    // useNavigationのモックを設定
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });

    const { getAllByTestId } = render(<MainTabNavigator />);
    
    // Pressableコンポーネント（タブボタン）を取得
    const tabButtons = getAllByTestId('Pressable');
    
    // FABボタンを見つける
    const fabButton = tabButtons.find(button => 
      button.props.children.some((child: any) => 
        child?.props?.name === 'add'
      )
    );
    
    // FABボタンをタップ
    if (fabButton) {
      fireEvent.press(fabButton);
    }
    
    // コーヒー記録フローに遷移しているか確認
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.COFFEE_RECORD_FLOW);
  });
});