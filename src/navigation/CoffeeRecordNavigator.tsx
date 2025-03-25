import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '../constants/routes';
import { RootStackParamList } from '../types';

// スクリーン
import CoffeeInfoScreen from '../screens/CoffeeRecord/CoffeeInfoScreen';
import CoffeeTasteScreen from '../screens/CoffeeRecord/CoffeeTasteScreen';
import CoffeeResultScreen from '../screens/CoffeeRecord/CoffeeResultScreen';

const CoffeeRecordStack = createNativeStackNavigator();

/**
 * コーヒー記録フローのナビゲーター
 * このフローには3つの画面が含まれています：
 * 1. コーヒー基本情報の入力 (CoffeeInfoScreen)
 * 2. 味わいの記録 (CoffeeTasteScreen)
 * 3. 結果の表示 (CoffeeResultScreen)
 */
const CoffeeRecordNavigator = () => {
  return (
    <CoffeeRecordStack.Navigator
      initialRouteName={ROUTES.COFFEE_RECORD_INFO}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true, // スワイプバックを許可
        presentation: 'card', // カードスタイルの遷移
      }}
    >
      <CoffeeRecordStack.Screen
        name={ROUTES.COFFEE_RECORD_INFO}
        component={CoffeeInfoScreen}
        options={{
          gestureEnabled: false, // 初期画面からのスワイプバックを禁止
        }}
      />
      <CoffeeRecordStack.Screen
        name={ROUTES.COFFEE_RECORD_TASTE}
        component={CoffeeTasteScreen}
      />
      <CoffeeRecordStack.Screen
        name={ROUTES.COFFEE_RECORD_RESULT}
        component={CoffeeResultScreen}
        options={{
          gestureEnabled: false, // 結果画面からスワイプバックを禁止
        }}
      />
    </CoffeeRecordStack.Navigator>
  );
};

export default CoffeeRecordNavigator;