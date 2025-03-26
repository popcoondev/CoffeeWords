import React from 'react';
import { ScrollView, Box, VStack, Heading, Text, HStack, Pressable, Icon, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

// 仮のデータ
const todayTraining = {
  title: '「酸味」と「明るさ」の違いを探る',
  description: '酸味は舌の側面で感じる刺激、明るさは全体的な印象の明るさです。今日はその違いに注目してみましょう。',
};

const recentDiscoveries = [
  {
    id: '1',
    date: '3/23',
    title: 'フローラルな香りへの好み',
    description: '花のような香りを持つコーヒーに特に魅力を感じることが分かりました。',
  },
  {
    id: '2',
    date: '3/20',
    title: '適切な抽出時間の発見',
    description: '30秒長くすることで、より甘みが引き出されることを発見しました。',
  },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const toast = useToast();

  const handleTrainingDetails = () => {
    // 実装予定: トレーニング詳細画面へ
    toast.show({
      title: "準備中",
      description: "この機能は近日公開予定です",
      status: "info"
    });
  };

  const handleDiscoveryPress = (id: string) => {
    // 実装予定: 発見詳細画面へ
    toast.show({
      title: "準備中",
      description: `ID: ${id} の詳細は近日公開予定です`,
      status: "info"
    });
  };

  return (
    <ScrollView flex={1} bg={COLORS.background.primary} px={4} pt={2} pb={6}>
      <VStack space={6}>
        {/* 今日のトレーニング */}
        <VStack space={2}>
          <Heading size="md"><Text>今日のトレーニング</Text></Heading>
          <Card>
            <VStack space={3}>
              <Text fontWeight="bold">{todayTraining.title}</Text>
              <Text numberOfLines={2}>{todayTraining.description}</Text>
              <Button 
                label="詳細を読む" 
                variant="outline" 
                onPress={handleTrainingDetails} 
                size="sm"
              />
            </VStack>
          </Card>
        </VStack>

        {/* 今日のコーヒーを記録 */}
        <VStack space={2}>
          <Heading size="md">今日のコーヒーを記録</Heading>
          <Card>
            <VStack alignItems="center" space={4} py={4}>
              <Box 
                bg={COLORS.secondary[500]} 
                p={4} 
                rounded="full"
              >
                <Icon 
                  as={Ionicons} 
                  name="camera" 
                  size="xl" 
                  color={COLORS.primary[500]} 
                />
              </Box>
              <Text fontWeight="medium">コーヒーを飲んだらタップして記録</Text>
              <Button label="記録する" onPress={() => navigation.navigate(ROUTES.COFFEE_RECORD_FLOW)} />
            </VStack>
          </Card>
        </VStack>

        {/* あなたの発見 */}
        <VStack space={2}>
          <Heading size="md"><Text>あなたの発見</Text></Heading>
          <Card>
            <VStack divider={<Box bg={COLORS.text.light} h="1px" my={2} opacity={0.2} />}>
              {recentDiscoveries.map((discovery) => (
                <Pressable 
                  key={discovery.id} 
                  onPress={() => handleDiscoveryPress(discovery.id)}
                  py={2}
                  _pressed={{ opacity: 0.7 }}
                >
                  <HStack space={3} alignItems="center">
                    <VStack w="16" alignItems="center" justifyContent="center">
                      <Text color={COLORS.primary[500]} fontWeight="bold">{discovery.date}</Text>
                    </VStack>
                    <VStack flex={1}>
                      <Text fontWeight="bold">{discovery.title}</Text>
                      <Text numberOfLines={1} fontSize="xs" color={COLORS.text.secondary}>
                        {discovery.description}
                      </Text>
                    </VStack>
                    <Icon 
                      as={Ionicons} 
                      name="chevron-forward" 
                      size="sm" 
                      color={COLORS.text.light} 
                    />
                  </HStack>
                </Pressable>
              ))}
            </VStack>
          </Card>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default HomeScreen;