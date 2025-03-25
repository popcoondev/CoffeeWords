import React, { useState } from 'react';
import { Box, VStack, Heading, Text, ScrollView } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Button } from '../../components/ui/Button';
import { ChoiceButton } from '../../components/ui/ChoiceButton';
import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';

type ExperienceLevelNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const experienceLevels = [
  {
    level: 'beginner',
    label: '初心者',
    icon: '☕',
    description: 'コーヒーは好きだけど、専門知識はあまりない。コーヒーの味わいについて学び始めたいと思っている。',
  },
  {
    level: 'intermediate',
    label: '中級者',
    icon: '☕☕',
    description: 'いくつかの産地や焙煎度の違いが分かる。自分なりの好みがあるが、もっと詳しく理解したい。',
  },
  {
    level: 'advanced',
    label: '上級者',
    icon: '☕☕☕',
    description: '様々な産地や精製方法の特徴が分かる。より専門的な言葉で自分の味覚を表現したい。',
  },
];

const ExperienceLevelScreen: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const navigation = useNavigation<ExperienceLevelNavigationProp>();

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
  };

  const handleNext = () => {
    // 実際の実装では選択された経験レベルを保存する
    // ここでは簡略化のために次の画面に進むだけ
    navigation.navigate(ROUTES.MAIN);
  };

  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <ScrollView flex={1} px={6} contentContainerStyle={{ paddingBottom: 20 }}>
        <VStack space={6} mt={8}>
          <VStack space={2}>
            <Heading textAlign="center" size="lg">
              あなたのコーヒー体験レベルは？
            </Heading>
            <Text textAlign="center" color={COLORS.text.secondary}>
              あなたに最適なトレーニングをご用意します
            </Text>
          </VStack>

          <VStack space={4} mt={4}>
            {experienceLevels.map((item) => (
              <ChoiceButton
                key={item.level}
                label={item.label}
                icon={item.icon}
                description={item.description}
                isSelected={selectedLevel === item.level}
                onPress={() => handleLevelSelect(item.level)}
              />
            ))}
          </VStack>
        </VStack>
      </ScrollView>

      <Box px={6} py={4} bg={COLORS.background.primary}>
        <Button
          label="次へ"
          onPress={handleNext}
          isDisabled={!selectedLevel}
          opacity={!selectedLevel ? 0.5 : 1}
        />
      </Box>
    </Box>
  );
};

export default ExperienceLevelScreen;