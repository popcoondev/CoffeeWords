import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, VStack, Heading, Text, Button, HStack, Icon, Pressable, useToast } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useExplorationStore } from '../../store/useExplorationStore';
import { ScreenProps } from '../../types';
import TasteMap from '../../components/map/TasteMap';
import { extractMapCharacteristics } from '../../services/openai/prompts';

/**
 * 味わいマップ位置設定画面
 * コーヒーの味わいをマップ上で位置付ける
 */
const ExplorationTasteMapScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const toast = useToast();
  
  // パラメータから取得
  const { coffeeInfo } = route.params || {};
  
  // Exploration Store
  const { 
    mapPosition, 
    mapCharacteristics,
    setMapPosition 
  } = useExplorationStore();
  
  // 初期特性の設定
  useEffect(() => {
    if (!mapCharacteristics) {
      const initialCharacteristics = extractMapCharacteristics(mapPosition);
      setMapPosition(mapPosition, initialCharacteristics);
    }
  }, []);
  
  // 戻るボタン
  const handleBack = () => {
    navigation.goBack();
  };
  
  // マップ位置変更ハンドラー
  const handlePositionChange = (position: any, characteristics: any) => {
    setMapPosition(position, characteristics);
  };
  
  // 次へボタン
  const handleNext = () => {
    if (!mapCharacteristics) {
      toast.show({
        title: "エラー",
        description: "味わいの位置を選択してください",
        status: "error"
      });
      return;
    }
    
    // 次のステップに進む（好み評価画面）
    navigation.navigate(ROUTES.EXPLORATION_PREFERENCES, {
      coffeeInfo,
      mapPosition,
      mapCharacteristics
    });
  };
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleBack} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">味わいマップ</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>
      
      <ScrollView flex={1} px={4} py={2}>
        <VStack space={6} alignItems="center">
          <Box w="full" rounded="lg" bg={COLORS.background.secondary} p={4}>
            <Text fontSize="lg" fontWeight="bold" color={COLORS.primary[500]} mb={2}>
              {coffeeInfo.name}
            </Text>
            {coffeeInfo.roaster && (
              <Text fontSize="sm" color={COLORS.text.secondary}>
                焙煎: {coffeeInfo.roaster}
              </Text>
            )}
          </Box>
          
          <VStack space={3} w="full">
            <Text fontSize="md" fontWeight="bold" color={COLORS.text.primary} textAlign="center">
              このコーヒーの味わいを位置づけてください
            </Text>
            
            <Text fontSize="sm" color={COLORS.text.secondary} textAlign="center" mb={2}>
              マップをタップして、あなたが感じた味わいの位置を示してください。
              縦軸は重さ、横軸は酸味と苦味のバランスを表します。
            </Text>
            
            <TasteMap
              initialPosition={mapPosition}
              onPositionChange={handlePositionChange}
              size="large"
            />
          </VStack>
          
          <Box w="full" p={4} bg="white" rounded="lg" mt={2}>
            <Text fontSize="sm" color={COLORS.text.secondary} mb={2}>
              味わいの位置決めのヒント:
            </Text>
            <VStack space={2}>
              <HStack space={2} alignItems="center">
                <Icon as={Ionicons} name="arrow-up" color={COLORS.primary[500]} />
                <Text fontSize="sm" color={COLORS.text.primary}>上: 軽やかでさっぱりとした口当たり</Text>
              </HStack>
              <HStack space={2} alignItems="center">
                <Icon as={Ionicons} name="arrow-down" color={COLORS.primary[500]} />
                <Text fontSize="sm" color={COLORS.text.primary}>下: 重厚でコクのある口当たり</Text>
              </HStack>
              <HStack space={2} alignItems="center">
                <Icon as={Ionicons} name="arrow-back" color={COLORS.primary[500]} />
                <Text fontSize="sm" color={COLORS.text.primary}>左: 明るい酸味が特徴的</Text>
              </HStack>
              <HStack space={2} alignItems="center">
                <Icon as={Ionicons} name="arrow-forward" color={COLORS.primary[500]} />
                <Text fontSize="sm" color={COLORS.text.primary}>右: はっきりとした苦味が特徴的</Text>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
      
      <Box px={6} py={4} bg={COLORS.background.primary} borderTopWidth={1} borderTopColor={COLORS.background.secondary}>
        <Button
          onPress={handleNext}
          bg={COLORS.primary[500]}
          _pressed={{ bg: COLORS.primary[600] }}
          _text={{ color: 'white' }}
        >
          次へ
        </Button>
      </Box>
    </Box>
  );
};

export default ExplorationTasteMapScreen;