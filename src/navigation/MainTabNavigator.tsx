import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Text, Box, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ROUTES } from '../constants/routes';
import { COLORS } from '../constants/theme';
import { RootStackParamList } from '../types';

// スクリーン
import HomeScreen from '../screens/Home/HomeScreen';
import DictionaryScreen from '../screens/Dictionary/DictionaryScreen';
import PreferenceScreen from '../screens/Preference/PreferenceScreen';

const Tab = createBottomTabNavigator();

type MainTabNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

/**
 * メイン画面のタブナビゲーター
 * ホーム、辞典、設定の3つのタブ画面を含む
 */
const MainTabNavigator = () => {
  const stackNavigation = useNavigation<MainTabNavigationProp>();

  // FABのコーヒー記録ボタンを押した時の処理
  const handleAddCoffeeRecord = () => {
    stackNavigation.navigate(ROUTES.COFFEE_RECORD_FLOW);
  };

  // カスタムのタブバーコンポーネント
  const TabBar = ({ state, descriptors, navigation }: any) => {
    return (
      <Box flexDirection="row" bg={COLORS.background.primary} 
        borderTopWidth={1} borderTopColor={COLORS.text.light + '20'} 
        alignItems="center" safeAreaBottom
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          let iconName = '';
          if (route.name === ROUTES.HOME) {
            iconName = isFocused ? 'home' : 'home-outline';
          } else if (route.name === ROUTES.DICTIONARY) {
            iconName = isFocused ? 'book' : 'book-outline';
          } else if (route.name === ROUTES.PREFERENCE) {
            iconName = isFocused ? 'heart' : 'heart-outline';
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

        {/* 中央のFABボタン - 今日の一杯記録 */}
        <Box
          position="absolute"
          top="-20px"
          left="50%"
          style={{ transform: [{ translateX: -30 }] }}
          zIndex={1}
        >
          <Pressable
            w="60px"
            h="60px"
            bg={COLORS.primary[500]}
            rounded="full"
            justifyContent="center"
            alignItems="center"
            shadow={3}
            onPress={handleAddCoffeeRecord}
            _pressed={{ bg: COLORS.primary[600] }}
            accessibilityLabel="今日の一杯を記録する"
            accessibilityHint="タップしてコーヒーの記録を開始"
          >
            <VStack alignItems="center" space={0}>
              <Icon as={Ionicons} name="cafe" size="md" color="white" />
              <Text fontSize="9px" color="white" fontWeight="bold">記録</Text>
            </VStack>
          </Pressable>
        </Box>
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