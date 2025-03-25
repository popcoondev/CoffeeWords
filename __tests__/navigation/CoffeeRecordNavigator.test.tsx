import React from 'react';
import { render } from '@testing-library/react-native';
import CoffeeRecordNavigator from '../../src/navigation/CoffeeRecordNavigator';
import { ROUTES } from '../../src/constants/routes';

// React Navigation Native Stackのモック
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children, initialRouteName, screenOptions }: any) => (
      <div data-testid="navigator" data-initialroutename={initialRouteName}>
        {children}
      </div>
    ),
    Screen: ({ name, component, options }: any) => (
      <div data-testid={`screen-${name}`} data-options={JSON.stringify(options)}>
        {name}
      </div>
    ),
  }),
}));

describe('CoffeeRecordNavigator', () => {
  it('コーヒー記録フローの3つの画面を含む', () => {
    const { getByTestId } = render(<CoffeeRecordNavigator />);
    
    // 初期ルートがCOFFEE_RECORD_INFOであることを確認
    expect(getByTestId('navigator').props['data-initialroutename']).toBe(ROUTES.COFFEE_RECORD_INFO);
    
    // 各画面が存在することを確認
    expect(getByTestId(`screen-${ROUTES.COFFEE_RECORD_INFO}`)).toBeTruthy();
    expect(getByTestId(`screen-${ROUTES.COFFEE_RECORD_TASTE}`)).toBeTruthy();
    expect(getByTestId(`screen-${ROUTES.COFFEE_RECORD_RESULT}`)).toBeTruthy();
  });
  
  it('初期画面と結果画面はスワイプバックが無効になっている', () => {
    const { getByTestId } = render(<CoffeeRecordNavigator />);
    
    // 初期画面のオプションを取得
    const infoScreenOptions = JSON.parse(
      getByTestId(`screen-${ROUTES.COFFEE_RECORD_INFO}`).props['data-options'] || '{}'
    );
    
    // 結果画面のオプションを取得
    const resultScreenOptions = JSON.parse(
      getByTestId(`screen-${ROUTES.COFFEE_RECORD_RESULT}`).props['data-options'] || '{}'
    );
    
    // スワイプバックが無効になっているか確認
    expect(infoScreenOptions.gestureEnabled).toBe(false);
    expect(resultScreenOptions.gestureEnabled).toBe(false);
  });
});