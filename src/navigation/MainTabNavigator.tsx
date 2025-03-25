import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES } from '../constants/routes';
import { COLORS } from '../constants/theme';

// スクリーン
import HomeScreen from '../screens/Home/HomeScreen';
import DictionaryScreen from '../screens/Dictionary/DictionaryScreen';
import PreferenceScreen from '../screens/Preference/PreferenceScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === ROUTES.HOME) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.DICTIONARY) {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === ROUTES.PREFERENCE) {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Icon as={Ionicons} name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary[500],
        tabBarInactiveTintColor: COLORS.text.light,
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.background.primary,
        },
        headerTitleStyle: {
          color: COLORS.text.primary,
        },
      })}
    >
      <Tab.Screen 
        name={ROUTES.HOME} 
        component={HomeScreen} 
        options={{ title: '今日の一杯' }}
      />
      <Tab.Screen 
        name={ROUTES.DICTIONARY} 
        component={DictionaryScreen} 
        options={{ title: 'コーヒー辞典' }}
      />
      <Tab.Screen 
        name={ROUTES.PREFERENCE} 
        component={PreferenceScreen} 
        options={{ title: 'あなたの好み' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;