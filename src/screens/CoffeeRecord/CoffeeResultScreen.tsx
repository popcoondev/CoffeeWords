import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Icon, HStack, Pressable, Text, ScrollView, Center, Spinner, Image, useToast, Divider } from 'native-base';
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
import { useCoffeeStorage } from '../../hooks/useCoffeeStorage';
import { useLanguageGeneration } from '../../hooks/useLanguageGeneration';
import { useAuth } from '../../hooks/useAuth';

type CoffeeResultNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoffeeRecordResult'>;

const CoffeeResultScreen: React.FC = () => {
  const navigation = useNavigation<CoffeeResultNavigationProp>();
  const toast = useToast();
  const { user } = useAuth();
  
  // 従来のZustandのステート管理
  const {
    name,
    roaster,
    photoURL,
    body,
    flavor,
    aftertaste,
    languageResult,
    tags,
    resetForm,
    isSubmitting,
    setLanguageResult,
  } = useCoffeeRecord();
  
  // Firebase連携のためのフック
  const { 
    createRecord, 
    loading: firebaseLoading, 
    error: firebaseError 
  } = useCoffeeStorage();
  
  // OpenAI言語化フック
  const { result: languageGenerationResult } = useLanguageGeneration();
  
  // ローカルステート
  const [isSaving, setIsSaving] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [detailedDescription, setDetailedDescription] = useState<string>('');
  const [recommendedCoffees, setRecommendedCoffees] = useState<string[]>([]);
  
  // 言語化結果を取得・設定
  useEffect(() => {
    if (languageGenerationResult) {
      setDetailedDescription(languageGenerationResult.detailedDescription || '');
      setRecommendedCoffees(languageGenerationResult.recommendations || [
        'エチオピア シダモ',
        'グアテマラ アンティグア',
        'コロンビア ウイラ',
      ]);
    } else {
      // 言語化結果がない場合のデフォルト設定
      setDetailedDescription('適度な酸味と甘みのバランスが良く、滑らかな口当たりが特徴です。心地よい余韻が続き、次の一口を誘います。');
      setRecommendedCoffees([
        'エチオピア シダモ',
        'グアテマラ アンティグア',
        'コロンビア ウイラ',
      ]);
    }
  }, [languageGenerationResult]);
  
  // 言語結果がない場合のフォールバック対応
  useEffect(() => {
    if (!languageResult || languageResult.trim() === '') {
      try {
        console.log('Using fallback values instead');
        setLanguageResult('バランスの取れた味わいと心地よい余韻を持つ魅力的なコーヒー');
      } catch (error) {
        console.error('Error setting language result:', error);
      }
    }
  }, [languageResult, setLanguageResult]);
  
  // エラーハンドリング
  useEffect(() => {
    if (firebaseError) {
      toast.show({
        title: "エラー",
        description: firebaseError,
        status: "error"
      });
    }
  }, [firebaseError, toast]);

  const handleClose = () => {
    resetForm();
    navigation.navigate(ROUTES.MAIN);
  };

  const handleSave = async () => {
    if (!user) {
      toast.show({
        title: "ログインが必要です",
        description: "コーヒー記録を保存するには、ログインしてください",
        status: "warning"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Firebase Storageに記録を保存
      const data = {
        coffeeInfo: {
          name,
          roaster,
          photoURI: photoURL
        },
        responses: {
          body,
          flavor,
          aftertaste
        }
      };
      
      const newRecordId = await createRecord(data);
      
      if (newRecordId) {
        setRecordId(newRecordId);
        
        toast.show({
          title: "保存完了",
          description: "コーヒー記録が正常に保存されました",
          status: "success"
        });
        
        resetForm();
        navigation.navigate(ROUTES.MAIN);
      } else {
        toast.show({
          title: "エラー",
          description: "記録の保存に失敗しました",
          status: "error"
        });
      }
    } catch (error) {
      console.error("Save record error:", error);
      toast.show({
        title: "エラー",
        description: "記録の保存中にエラーが発生しました",
        status: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleClose} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="close" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md"><Text>あなたのコーヒーを言語化しました</Text></Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>

      <ScrollView flex={1} px={6} py={4}>
        <VStack space={6}>
          <Card variant="accent">
            <VStack space={4}>
              <HStack space={2}>
                <Box bg={COLORS.primary[500]} w={2} h="full" rounded="full" />
                <VStack flex={1}>
                  <Text fontWeight="bold" fontSize="lg">
                    {name || "名称なし"}
                  </Text>
                  {roaster && (
                    <Text fontSize="sm" color={COLORS.text.secondary}>
                      {roaster}
                    </Text>
                  )}
                </VStack>
                
                {photoURL && (
                  <Box size={16} overflow="hidden" rounded="md">
                    <Image 
                      source={{ uri: photoURL }}
                      alt="コーヒー画像"
                      size="full"
                      resizeMode="cover"
                    />
                  </Box>
                )}
              </HStack>

              <VStack space={3}>
                <Text fontSize="md" fontWeight="bold" italic>
                  "{languageResult || "コーヒーの言語化結果がここに表示されます"}"
                </Text>
                
                {detailedDescription && (
                  <>
                    <Divider />
                    <Text fontSize="sm">
                      {detailedDescription}
                    </Text>
                  </>
                )}
              </VStack>
            </VStack>
          </Card>

          <VStack space={2}>
            <Heading size="sm"><Text>あなたの味覚タグ:</Text></Heading>
            <HStack flexWrap="wrap">
              {tags.map((tag, index) => (
                <Tag key={index} label={tag} />
              ))}
            </HStack>
          </VStack>

          <VStack space={2}>
            <Heading size="sm"><Text>似た味わいの豆:</Text></Heading>
            <Box>
              {recommendedCoffees.length > 0 ? (
                recommendedCoffees.map((coffee, index) => (
                  <HStack key={index} space={2} alignItems="center" mb={2}>
                    <Icon 
                      as={Ionicons} 
                      name="cafe" 
                      size="sm" 
                      color={COLORS.primary[500]} 
                    />
                    <Text>{coffee}</Text>
                  </HStack>
                ))
              ) : (
                <Text color={COLORS.text.secondary}>
                  推奨コーヒーが見つかりませんでした
                </Text>
              )}
            </Box>
          </VStack>
        </VStack>
      </ScrollView>

      <Box px={6} py={4} bg={COLORS.background.primary}>
        {isSaving || firebaseLoading ? (
          <Center py={2}>
            <Spinner color={COLORS.primary[500]} size="lg" />
            <Text mt={2} color={COLORS.text.secondary}>保存しています...</Text>
          </Center>
        ) : (
          <VStack space={3}>
            <Button
              label="保存して終了"
              onPress={handleSave}
              isDisabled={isSubmitting || !user}
            />
            {!user && (
              <Text color={COLORS.error} textAlign="center" fontSize="sm">
                ログインすると記録を保存できます
              </Text>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default CoffeeResultScreen;