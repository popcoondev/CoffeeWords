import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Text, Box, Pressable, VStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES } from '../constants/routes';
import { COLORS } from '../constants/theme';

// スクリーン
import HomeScreen from '../screens/Home/HomeScreen';
import DictionaryScreen from '../screens/Dictionary/DictionaryScreen'; // 後で翻訳辞書画面に変更予定
import TasteMapScreen from '../screens/TasteMap/TasteMapScreen'; // 新しい画面

const Tab = createBottomTabNavigator();

/**
 * メイン画面のタブナビゲーター
 * ホーム、翻訳辞書、味わい探検マップの3つのタブ画面を含む
 */
const MainTabNavigator = () => {
  // カスタムのタブバーコンポーネント
  const TabBar = ({ state, descriptors, navigation }: any) => {
    return (
      <Box 
        flexDirection="row" 
        bg={COLORS.background.primary} 
        borderTopWidth={1} 
        borderTopColor={COLORS.text.light + '20'} 
        alignItems="center" 
        safeAreaBottom
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          let iconName = '';
          if (route.name === ROUTES.HOME) {
            iconName = isFocused ? 'compass' : 'compass-outline';
          } else if (route.name === ROUTES.DICTIONARY) {
            iconName = isFocused ? 'book' : 'book-outline';
          } else if (route.name === ROUTES.TASTE_MAP) {
            iconName = isFocused ? 'map' : 'map-outline';
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={index}
              opacity={1}
              flex={1}
              py={2}
              alignItems="center"
              onPress={onPress}
            >
              <Icon
                as={Ionicons}
                name={iconName}
                size="md"
                color={isFocused ? COLORS.primary[500] : COLORS.text.light}
              />
              <Text
                fontSize="xs"
                color={isFocused ? COLORS.primary[500] : COLORS.text.light}
                mt={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </Box>
    );
  };

  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.background.primary,
        },
        headerTitleStyle: {
          color: COLORS.text.primary,
        },
        tabBarActiveTintColor: COLORS.primary[500],
        tabBarInactiveTintColor: COLORS.text.light,
      }}
    >
      <Tab.Screen 
        name={ROUTES.HOME} 
        component={HomeScreen} 
        options={{ title: '今日の探検' }}
      />
      <Tab.Screen 
        name={ROUTES.DICTIONARY} 
        component={DictionaryScreen} 
        options={{ title: '翻訳辞書' }}
      />
      <Tab.Screen 
        name={ROUTES.TASTE_MAP} 
        component={TasteMapScreen} 
        options={{ title: '味わい探検マップ' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;