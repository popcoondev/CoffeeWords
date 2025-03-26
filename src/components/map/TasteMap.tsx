import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import { Box, Text, VStack, useTheme } from 'native-base';
import { extractMapCharacteristics } from '../../services/openai/prompts';
import { COLORS } from '../../constants/theme';

interface TasteMapProps {
  initialPosition?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }, characteristics: any) => void;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

/**
 * 味わいマップコンポーネント
 * @param props コンポーネントのプロパティ
 * @returns コンポーネント
 */
const TasteMap: React.FC<TasteMapProps> = ({
  initialPosition = { x: 200, y: 200 },
  onPositionChange,
  size = 'medium',
  interactive = true
}) => {
  const theme = useTheme();
  const [position, setPosition] = useState(initialPosition);
  const [characteristics, setCharacteristics] = useState<any>({});
  
  // マップのサイズを決定
  const getMapSize = () => {
    switch (size) {
      case 'small': return 200;
      case 'large': return 350;
      case 'medium':
      default: return 280;
    }
  };
  
  const mapSize = getMapSize();
  
  useEffect(() => {
    // 特性の抽出
    const extracted = extractMapCharacteristics(position);
    setCharacteristics(extracted);
    
    // 親コンポーネントへの通知
    if (onPositionChange) {
      onPositionChange(position, extracted);
    }
  }, [position, onPositionChange]);
  
  // タップ位置の更新
  const handlePress = (event: GestureResponderEvent) => {
    if (!interactive) return;
    
    const { locationX, locationY } = event.nativeEvent;
    
    // マップの境界内に制限
    const newPosition = {
      x: Math.max(0, Math.min(mapSize, locationX)),
      y: Math.max(0, Math.min(mapSize, locationY))
    };
    
    setPosition(newPosition);
  };
  
  return (
    <Box p={4} bg={COLORS.background.secondary} borderRadius="lg">
      <Text fontSize="lg" fontWeight="bold" color={COLORS.primary[500]} mb={2} textAlign="center">
        あなたのコーヒーはどの位置？
      </Text>
      <Text fontSize="sm" color={COLORS.text.secondary} mb={4} textAlign="center">
        {interactive ? 'タップして位置を示してください' : '味わいの位置'}
      </Text>
      
      <TouchableWithoutFeedback onPress={handlePress}>
        <Box 
          width={mapSize} 
          height={mapSize} 
          bg="white"
          borderRadius="md"
          borderWidth={1}
          borderColor={COLORS.accent[500]}
          position="relative"
          alignSelf="center"
        >
          {/* 軸 */}
          <Box 
            position="absolute"
            width="100%"
            height={1}
            bg={COLORS.accent[500]}
            opacity={0.5}
            top="50%"
          />
          <Box 
            position="absolute"
            width={1}
            height="100%"
            bg={COLORS.accent[500]}
            opacity={0.5}
            left="50%"
          />
          
          {/* 軸ラベル */}
          <Text 
            position="absolute"
            top={2}
            alignSelf="center"
            fontSize="xs"
            color={COLORS.primary[500]}
          >
            軽やか
          </Text>
          <Text 
            position="absolute"
            bottom={2}
            alignSelf="center"
            fontSize="xs"
            color={COLORS.primary[500]}
          >
            重厚
          </Text>
          <Text 
            position="absolute"
            left={2}
            top="50%"
            fontSize="xs"
            color={COLORS.primary[500]}
            style={{ transform: [{ translateY: -6 }] }}
          >
            酸味
          </Text>
          <Text 
            position="absolute"
            right={2}
            top="50%"
            fontSize="xs"
            color={COLORS.primary[500]}
            style={{ transform: [{ translateY: -6 }] }}
          >
            苦味
          </Text>
          
          {/* 選択マーカー */}
          <Box
            position="absolute"
            width={5}
            height={5}
            borderRadius="full"
            bg={COLORS.primary[500]}
            left={position.x}
            top={position.y}
            style={{ transform: [{ translateX: -10 }, { translateY: -10 }] }}
          />
        </Box>
      </TouchableWithoutFeedback>
      
      {/* 特性表示 */}
      {characteristics && (
        <VStack mt={4} p={3} bg="white" borderRadius="md" borderWidth={1} borderColor={COLORS.accent[500]}>
          <Text fontSize="sm" fontWeight="bold" color={COLORS.primary[500]} mb={1}>
            この位置のコーヒー特性:
          </Text>
          <Text fontSize="sm" color={COLORS.text.secondary}>
            {characteristics.body || 'ミディアムボディ'}
            {characteristics.acidity ? `、${characteristics.acidity}` : ''}
            {characteristics.bitterness ? `、${characteristics.bitterness}` : ''}
            が特徴のコーヒーです。
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default TasteMap;