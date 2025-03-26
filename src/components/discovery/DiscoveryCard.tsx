import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, Text, HStack, VStack, Button, Pressable, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface DiscoveryCardProps {
  discovery: {
    name: string;
    category: string;
    description: string;
    rarity: number;
    isFirstDiscovery?: boolean;
    userInterpretation: string;
  };
  onAddToDictionary?: (discovery: any) => void;
  onViewDetail?: (discovery: any) => void;
}

/**
 * 発見カードコンポーネント
 * @param props コンポーネントのプロパティ
 * @returns コンポーネント
 */
const DiscoveryCard: React.FC<DiscoveryCardProps> = ({
  discovery,
  onAddToDictionary,
  onViewDetail
}) => {
  const { name, category, description, rarity, isFirstDiscovery = true, userInterpretation } = discovery;
  
  // カテゴリに基づくアイコンとカラーの設定
  const getCategoryMeta = (category: string) => {
    switch(category) {
      case 'acidity':
        return { icon: '🍋', color: '#FFD700' };
      case 'sweetness':
        return { icon: '🍯', color: '#FFA500' };
      case 'bitterness':
        return { icon: '🍫', color: '#8B4513' };
      case 'body':
        return { icon: '💪', color: '#A0522D' };
      case 'aroma':
        return { icon: '🌸', color: '#FF69B4' };
      case 'aftertaste':
        return { icon: '✨', color: '#9370DB' };
      default:
        return { icon: '☕', color: '#D4A76A' };
    }
  };
  
  const categoryMeta = getCategoryMeta(category);
  
  // レア度に基づく星表示
  const rarityStars = '★'.repeat(rarity) + '☆'.repeat(5 - rarity);
  
  return (
    <Box 
      bg={COLORS.background.secondary}
      borderRadius="xl"
      overflow="hidden"
      my={4}
      shadow={2}
    >
      <Box bg={COLORS.primary[500]} px={4} py={3}>
        <Text color="white" fontWeight="bold" fontSize="md" textAlign="center">
          {isFirstDiscovery ? '新しい発見！' : '再発見！'}
        </Text>
      </Box>
      
      <HStack p={4} bg="white">
        <Box 
          width={12}
          height={12}
          borderRadius="full"
          justifyContent="center"
          alignItems="center"
          mr={4}
          style={{ backgroundColor: categoryMeta.color }}
        >
          <Text fontSize="xl">{categoryMeta.icon}</Text>
        </Box>
        
        <VStack flex={1}>
          <Text fontWeight="bold" fontSize="lg" color={COLORS.text.primary} mb={1}>
            {name}
          </Text>
          <Text fontSize="sm" color={COLORS.text.secondary} mb={1}>
            {categoryToJapanese(category)}
          </Text>
          <Text fontSize="xs" color={COLORS.primary[500]}>
            レア度: {rarityStars}
          </Text>
        </VStack>
      </HStack>
      
      <Box 
        p={4} 
        bg="white" 
        borderTopWidth={1} 
        borderTopColor={COLORS.background.secondary}
      >
        <Text fontSize="sm" color={COLORS.text.primary} mb={2}>
          {description}
        </Text>
        <Text fontSize="sm" color={COLORS.text.secondary} fontStyle="italic">
          あなたにとって: {userInterpretation}
        </Text>
      </Box>
      
      <HStack 
        p={4} 
        bg={COLORS.background.secondary}
        justifyContent="space-between"
      >
        <Button
          flex={1}
          bg={COLORS.primary[500]}
          _pressed={{ bg: COLORS.primary[600] }}
          mr={2}
          onPress={() => onAddToDictionary && onAddToDictionary(discovery)}
        >
          <Text color="white" fontWeight="bold" fontSize="sm">辞書に追加</Text>
        </Button>
        
        <Button
          flex={1}
          variant="outline"
          borderColor={COLORS.primary[500]}
          _pressed={{ bg: COLORS.background.primary }}
          onPress={() => onViewDetail && onViewDetail(discovery)}
        >
          <Text color={COLORS.primary[500]} fontWeight="bold" fontSize="sm">詳細を見る</Text>
        </Button>
      </HStack>
    </Box>
  );
};

// カテゴリの日本語表示
const categoryToJapanese = (category: string): string => {
  const map: Record<string, string> = {
    'acidity': '酸味',
    'sweetness': '甘み',
    'bitterness': '苦味',
    'body': 'ボディ',
    'aroma': '香り',
    'aftertaste': '余韻',
    'general': '基本特性',
  };
  return map[category] || category;
};

export default DiscoveryCard;