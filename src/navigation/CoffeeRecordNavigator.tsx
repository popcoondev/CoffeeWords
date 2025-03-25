import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '../constants/routes';

// スクリーン
import CoffeeInfoScreen from '../screens/CoffeeRecord/CoffeeInfoScreen';
import CoffeeTasteScreen from '../screens/CoffeeRecord/CoffeeTasteScreen';
import CoffeeResultScreen from '../screens/CoffeeRecord/CoffeeResultScreen';

const CoffeeRecordStack = createNativeStackNavigator();

const CoffeeRecordNavigator = () => {
  return (
    <CoffeeRecordStack.Navigator
      initialRouteName={ROUTES.COFFEE_RECORD_INFO}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <CoffeeRecordStack.Screen
        name={ROUTES.COFFEE_RECORD_INFO}
        component={CoffeeInfoScreen}
      />
      <CoffeeRecordStack.Screen
        name={ROUTES.COFFEE_RECORD_TASTE}
        component={CoffeeTasteScreen}
      />
      <CoffeeRecordStack.Screen
        name={ROUTES.COFFEE_RECORD_RESULT}
        component={CoffeeResultScreen}
      />
    </CoffeeRecordStack.Navigator>
  );
};

export default CoffeeRecordNavigator;