import React, { useState } from 'react';
import { Box, VStack, Heading, Icon, HStack, Pressable, Text, ScrollView, Center, Spinner } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';
import { useCoffeeRecord } from '../../hooks/useCoffeeRecord';

type CoffeeResultNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoffeeRecordResult'>;

const CoffeeResultScreen: React.FC = () => {
  const navigation = useNavigation<CoffeeResultNavigationProp>();
  const {
    name,
    roaster,
    languageResult,
    tags,
    saveRecord,
    resetForm,
    isSubmitting,
  } = useCoffeeRecord();
  const [isSaving, setIsSaving] = useState(false);

  const handleClose = () => {
    resetForm();
    navigation.navigate(ROUTES.MAIN);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const recordId = await saveRecord();
    setIsSaving(false);
    
    if (recordId) {
      resetForm();
      navigation.navigate(ROUTES.MAIN);
    }
  };

  // サンプル推奨コーヒー（実際の実装ではAPIから取得）
  const recommendedCoffees = [
    'エチオピア シダモ',
    'グアテマラ アンティグア',
    'コロンビア ウイラ',
  ];

  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleClose} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="close" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">あなたのコーヒーを言語化しました</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>

      <ScrollView flex={1} px={6} py={4}>
        <VStack space={6}>
          <Card variant="accent">
            <VStack space={4}>
              <HStack space={2}>
                <Box bg={COLORS.primary[500]} w={2} h="full" rounded="full" />
                <Text fontWeight="bold" fontSize="lg">
                  {name}
                  {roaster && ` (${roaster})`}
                </Text>
              </HStack>

              <Text fontSize="md" italic>
                "{languageResult}"
              </Text>
            </VStack>
          </Card>

          <VStack space={2}>
            <Heading size="sm">あなたの味覚タグ:</Heading>
            <HStack flexWrap="wrap">
              {tags.map((tag, index) => (
                <Tag key={index} label={tag} />
              ))}
            </HStack>
          </VStack>

          <VStack space={2}>
            <Heading size="sm">似た味わいの豆:</Heading>
            <Box>
              {recommendedCoffees.map((coffee, index) => (
                <HStack key={index} space={2} alignItems="center" mb={2}>
                  <Icon 
                    as={Ionicons} 
                    name="cafe" 
                    size="sm" 
                    color={COLORS.primary[500]} 
                  />
                  <Text>{coffee}</Text>
                </HStack>
              ))}
            </Box>
          </VStack>
        </VStack>
      </ScrollView>

      <Box px={6} py={4} bg={COLORS.background.primary}>
        {isSaving ? (
          <Center py={2}>
            <Spinner color={COLORS.primary[500]} size="lg" />
            <Text mt={2} color={COLORS.text.secondary}>保存しています...</Text>
          </Center>
        ) : (
          <Button
            label="保存して終了"
            onPress={handleSave}
            isDisabled={isSubmitting}
          />
        )}
      </Box>
    </Box>
  );
};

export default CoffeeResultScreen;