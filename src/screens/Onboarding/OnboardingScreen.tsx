import React, { useState } from 'react';
import { Box, Text, VStack, Image, HStack, Heading, Center, useTheme, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '../../components/ui/Button';
import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';

// オンボーディングスライドの内容
const slides = [
  {
    title: 'コーヒーの味を言葉にする',
    description: '直感的な質問に答えるだけで、あなたの好みを専門的に表現できるようになります',
    icon: 'cafe', // Ioniconsのアイコン名
  },
  {
    title: 'あなただけの味覚辞典',
    description: '日々のコーヒーが、あなたの味覚辞典を作ります。専門用語を自分の言葉で理解しましょう',
    icon: 'book',
  },
  {
    title: '好みを発見する',
    description: '記録を続けることで、あなたの好みの傾向が見えてきます。新たな発見の旅に出かけましょう',
    icon: 'heart',
  },
];

type OnboardingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation<OnboardingNavigationProp>();
  const theme = useTheme();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.navigate(ROUTES.MAIN);
    }
  };

  const renderDots = () => {
    return (
      <HStack space={2} mt={6} mb={8} justifyContent="center">
        {slides.map((_, index) => (
          <Box
            key={index}
            w={2.5}
            h={2.5}
            rounded="full"
            bg={index === currentSlide ? COLORS.primary[500] : COLORS.text.light}
          />
        ))}
      </HStack>
    );
  };

  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <VStack flex={1} px={6} justifyContent="center" space={6}>
        <Heading textAlign="center" mb={2}>
          Coffee Words
        </Heading>

        <Center flex={1} justifyContent="center">
          <Icon
            as={Ionicons}
            name={slides[currentSlide].icon}
            size="6xl"
            color={COLORS.primary[500]}
          />
        </Center>

        <VStack flex={1} space={4}>
          <Heading size="md" textAlign="center">
            {slides[currentSlide].title}
          </Heading>
          
          <Text textAlign="center" px={4}>
            {slides[currentSlide].description}
          </Text>

          {renderDots()}

          <Button
            label={currentSlide < slides.length - 1 ? '次へ' : '始める'}
            onPress={handleNext}
            mt={4}
          />
        </VStack>
      </VStack>
    </Box>
  );
};

export default OnboardingScreen;