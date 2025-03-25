import React, { useEffect, useState } from 'react';
import { Box, VStack, Heading, Text, HStack, Pressable, Icon, ScrollView, Divider } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';
import { useLanguageGeneration } from '../../hooks/useLanguageGeneration';

type PreferenceNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

// レーダーチャートのデータ
const tasteProfile = [
  { name: '酸味', value: 0.7 },
  { name: '甘み', value: 0.9 },
  { name: '苦味', value: 0.3 },
  { name: 'ボディ', value: 0.5 },
  { name: 'フローラル', value: 0.6 },
  { name: 'フルーティー', value: 0.8 },
];

// 好みの特徴
const tastePreferences = [
  '甘みが強く、酸味も程よくあるコーヒー',
  '苦味は控えめが好み',
  '中程度のボディ感',
  'フルーティーな風味に高い満足度',
];

// おすすめの豆
const recommendedCoffees = [
  'エチオピア シダモ',
  'ブラジル セラード',
  'コスタリカ タラス',
];

const PreferenceScreen: React.FC = () => {
  const navigation = useNavigation<PreferenceNavigationProp>();
  const windowWidth = Dimensions.get('window').width;
  const chartSize = windowWidth - 80; // パディングを考慮
  const chartCenter = chartSize / 2;
  const chartRadius = chartSize * 0.4;
  
  // OpenAI API設定の状態確認
  const { hasKey, checkApiKey } = useLanguageGeneration();
  const [apiKeyStatus, setApiKeyStatus] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkApiKey();
      setApiKeyStatus(status);
    };
    
    checkStatus();
  }, [checkApiKey]);

  const handleSharePress = () => {
    // 実装予定: 共有機能
  };
  
  const handleOpenApiSettings = () => {
    // APIキー設定画面に遷移
    navigation.navigate(ROUTES.API_KEY_SETTINGS);
  };

  // レーダーチャートのポリゴン座標を計算
  const getPolygonPoints = () => {
    return tasteProfile.map((item, index) => {
      const angle = (Math.PI * 2 * index) / tasteProfile.length;
      const x = chartCenter + chartRadius * item.value * Math.sin(angle);
      const y = chartCenter - chartRadius * item.value * Math.cos(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // 軸の線と頂点の円の座標を計算
  const getAxisPoints = () => {
    return tasteProfile.map((item, index) => {
      const angle = (Math.PI * 2 * index) / tasteProfile.length;
      const x = chartCenter + chartRadius * Math.sin(angle);
      const y = chartCenter - chartRadius * Math.cos(angle);
      return { x, y, name: item.name, angle };
    });
  };

  return (
    <ScrollView flex={1} bg={COLORS.background.primary} px={4} pt={2} pb={6}>
      <HStack alignItems="center" justifyContent="space-between" mb={4}>
        <Heading size="lg">好みプロファイル</Heading>
        <Pressable 
          onPress={handleSharePress}
          bg={COLORS.background.secondary}
          p={2}
          rounded="full"
          _pressed={{ opacity: 0.7 }}
        >
          <Icon as={Ionicons} name="share-outline" size="md" color={COLORS.primary[500]} />
        </Pressable>
      </HStack>

      <VStack space={6}>
        {/* レーダーチャート */}
        <Card>
          <VStack space={2} alignItems="center">
            <Heading size="sm" textAlign="center" mb={2}>
              あなたの味わい傾向
            </Heading>
            
            <Box alignItems="center" justifyContent="center" h={chartSize} w={chartSize}>
              <Svg height={chartSize} width={chartSize}>
                {/* バックグラウンドの軸 */}
                {getAxisPoints().map((point, i) => (
                  <Line 
                    key={`axis-${i}`}
                    x1={chartCenter}
                    y1={chartCenter}
                    x2={point.x}
                    y2={point.y}
                    stroke={COLORS.text.light}
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                ))}
                
                {/* バックグラウンドの円 */}
                {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                  <Circle 
                    key={`circle-${i}`}
                    cx={chartCenter}
                    cy={chartCenter}
                    r={chartRadius * r}
                    fill="none"
                    stroke={COLORS.text.light}
                    strokeWidth="0.5"
                  />
                ))}
                
                {/* 値のポリゴン */}
                <Polygon
                  points={getPolygonPoints()}
                  fill={`${COLORS.primary[500]}40`} // 透明度40%
                  stroke={COLORS.primary[500]}
                  strokeWidth="2"
                />
                
                {/* ラベル */}
                {getAxisPoints().map((point, i) => (
                  <SvgText
                    key={`label-${i}`}
                    x={point.x > chartCenter ? point.x + 10 : point.x < chartCenter ? point.x - 10 : point.x}
                    y={point.y > chartCenter ? point.y + 10 : point.y < chartCenter ? point.y - 10 : point.y}
                    fontSize="12"
                    fontWeight="bold"
                    fill={COLORS.text.primary}
                    textAnchor={point.x > chartCenter ? "start" : point.x < chartCenter ? "end" : "middle"}
                    alignmentBaseline={point.y > chartCenter ? "hanging" : point.y < chartCenter ? "auto" : "middle"}
                  >
                    {point.name}
                  </SvgText>
                ))}
              </Svg>
            </Box>
          </VStack>
        </Card>

        {/* 好みの特徴 */}
        <VStack space={2}>
          <Heading size="md">好みの特徴</Heading>
          <Card>
            <VStack space={3}>
              {tastePreferences.map((preference, index) => (
                <HStack key={index} space={3} alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="checkmark-circle"
                    size="sm"
                    color={COLORS.primary[500]}
                  />
                  <Text>{preference}</Text>
                </HStack>
              ))}
            </VStack>
          </Card>
        </VStack>

        {/* おすすめの豆 */}
        <VStack space={2}>
          <Heading size="md">おすすめの豆</Heading>
          <Card>
            <VStack space={3}>
              {recommendedCoffees.map((coffee, index) => (
                <HStack key={index} space={3} alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="cafe"
                    size="sm"
                    color={COLORS.primary[500]}
                  />
                  <Text>{coffee}</Text>
                </HStack>
              ))}
              <Button
                label="もっと見る"
                variant="outline"
                size="sm"
                mt={2}
              />
            </VStack>
          </Card>
        </VStack>
        
        <Divider my={2} />
        
        {/* アプリ設定 */}
        <VStack space={2}>
          <Heading size="md">アプリ設定</Heading>
          <Card>
            <VStack space={3}>
              <Pressable onPress={handleOpenApiSettings}>
                <HStack alignItems="center" justifyContent="space-between" py={2}>
                  <HStack space={3} alignItems="center">
                    <Icon
                      as={Ionicons}
                      name="key"
                      size="sm"
                      color={COLORS.primary[500]}
                    />
                    <VStack>
                      <Text fontWeight="medium">OpenAI API設定</Text>
                      <Text fontSize="xs" color={COLORS.text.secondary}>
                        {apiKeyStatus 
                          ? "設定済み" 
                          : "未設定 - コーヒー言語化に必要です"}
                      </Text>
                    </VStack>
                  </HStack>
                  <Icon
                    as={Ionicons}
                    name="chevron-forward"
                    size="sm"
                    color={COLORS.text.light}
                  />
                </HStack>
              </Pressable>
            </VStack>
          </Card>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default PreferenceScreen;