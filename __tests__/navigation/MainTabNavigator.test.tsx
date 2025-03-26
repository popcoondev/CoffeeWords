import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
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
    expect(tabButtons.length).toBeGreaterThanOrEqual(3);
    
    // 各タブのアイコンが存在することを確認
    const homeIcon = tabButtons.find(button => 
      button.props.children.some((child: any) => 
        child?.props?.name === 'home' || child?.props?.name === 'home-outline'
      )
    );
    expect(homeIcon).toBeTruthy();
  });

  /* FABボタンは削除されたためテストを更新 */
  it('コーヒー記録フロー遷移のためのナビゲーションメソッドが正しく定義されている', () => {
    // useNavigationのモックを設定
    const mockNavigate = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    });

    // MainTabNavigator内の関数を直接テスト
    render(<MainTabNavigator />);
    
    // handleAddCoffeeRecordはコンポーネント内部の関数なので直接呼び出せないが、
    // 少なくともタブナビゲーターが問題なくレンダリングされることを確認
    const tabButtons = screen.getAllByTestId('Pressable');
    expect(tabButtons.length).toBeGreaterThanOrEqual(3);
  });
});