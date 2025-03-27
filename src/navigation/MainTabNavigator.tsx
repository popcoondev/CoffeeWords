import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Text, Box, Pressable, VStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { ROUTES } from '../constants/routes';
import { COLORS } from '../constants/theme';

// スクリーン
import HomeScreen from '../screens/Home/HomeScreen';
import TranslationDictionaryScreen from '../screens/Translation/TranslationDictionaryScreen';
import TasteMapScreen from '../screens/TasteMap/TasteMapScreen';
import PreferenceScreen from '../screens/Preference/PreferenceScreen';

// @ts-ignore - React Navigation v7との互換性のため
const Tab = createBottomTabNavigator();

/**
 * メイン画面のタブナビゲーター
 * ホーム、翻訳辞書、味わい探検マップ、設定の4つのタブ画面を含む
 */
// タブナビゲーター用に固定のルート名を定義
const TAB_ROUTES = {
  HOME: ROUTES.HOME,
  DICTIONARY: ROUTES.TRANSLATION_DICTIONARY,
  TASTE_MAP: ROUTES.TASTE_MAP,
  PREFERENCE: ROUTES.PREFERENCE
};

const MainTabNavigator = () => {
  // カスタムのタブバーコンポーネント
  const TabBar = ({ state, descriptors, navigation }: any) => {
    // ルートが不正な場合に備えて早期リターン
    if (!state || !state.routes || !Array.isArray(state.routes)) {
      console.warn('TabBar: invalid state', state);
      return null;
    }

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
          if (!route || !route.key || !descriptors || !descriptors[route.key]) {
            console.warn('TabBar: invalid route or descriptor', { route, index, descriptors });
            return null;
          }

          const { options } = descriptors[route.key];
          // 必ず文字列になるようにフォールバック
          const label = (options.tabBarLabel || options.title || route.name || `タブ${index + 1}`) + '';
          const isFocused = state.index === index;

          let iconName = 'help-outline'; // デフォルトアイコン
          // 固定のルートパターンを使用
          if (route.name === TAB_ROUTES.HOME) {
            iconName = isFocused ? 'compass' : 'compass-outline';
          } else if (route.name === TAB_ROUTES.DICTIONARY) {
            iconName = isFocused ? 'book' : 'book-outline';
          } else if (route.name === TAB_ROUTES.TASTE_MAP) {
            iconName = isFocused ? 'map' : 'map-outline';
          } else if (route.name === TAB_ROUTES.PREFERENCE) {
            iconName = isFocused ? 'settings' : 'settings-outline';
          }

          const onPress = () => {
            // ナビゲーションとルートのバリデーション
            if (!navigation || !navigation.emit || !route || !route.key) {
              console.warn('TabBar: invalid navigation or route for onPress', { navigation, route });
              return;
            }

            try {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented && route.name) {
                navigation.navigate(route.name);
              }
            } catch (error) {
              console.error('TabBar: error in onPress', error);
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
              {typeof label === 'string' && (
                <Text
                  fontSize="xs"
                  color={isFocused ? COLORS.primary[500] : COLORS.text.light}
                  mt={1}
                >
                  {label}
                </Text>
              )}
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
        name={TAB_ROUTES.HOME} 
        component={HomeScreen} 
        options={{ title: '今日の探検' }}
      />
      <Tab.Screen 
        name={TAB_ROUTES.DICTIONARY} 
        component={TranslationDictionaryScreen} 
        options={{ title: '翻訳辞書' }}
      />
      <Tab.Screen 
        name={TAB_ROUTES.TASTE_MAP} 
        component={TasteMapScreen} 
        options={{ title: '味わい探検マップ' }}
      />
      <Tab.Screen 
        name={TAB_ROUTES.PREFERENCE} 
        component={PreferenceScreen} 
        options={{ title: '設定' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;