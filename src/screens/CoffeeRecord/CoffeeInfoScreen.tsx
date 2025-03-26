import React, { useState, useEffect } from 'react';
import { Box, VStack, Heading, Icon, HStack, Pressable, Text, ScrollView, Image, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { RootStackParamList } from '../../types';
import { ROUTES } from '../../constants/routes';
import { COLORS } from '../../constants/theme';
import { useCoffeeRecord } from '../../hooks/useCoffeeRecord';
import { useCoffeeStorage } from '../../hooks/useCoffeeStorage';
import { useLanguageGeneration } from '../../hooks/useLanguageGeneration';

type CoffeeInfoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoffeeRecordFlow'>;

const CoffeeInfoScreen: React.FC = () => {
  const navigation = useNavigation<CoffeeInfoNavigationProp>();
  const toast = useToast();
  
  // 従来のZustandのステート管理
  const { 
    name, 
    roaster, 
    photoURL, 
    setName, 
    setRoaster, 
    setPhotoURL
  } = useCoffeeRecord();
  
  // Firebase連携のためのフック
  const { uploadImage, loading: uploading } = useCoffeeStorage();
  
  // 言語生成のためのフック
  const { generateLanguage, loading: generatingText } = useLanguageGeneration();
  
  // ローカルステート
  const [imageUri, setImageUri] = useState<string | null>(photoURL);
  const [isUploading, setIsUploading] = useState(false);
  const [suggestedName, setSuggestedName] = useState<string | null>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    // 次のステップに進む（味わい質問画面）
    navigation.navigate(ROUTES.COFFEE_RECORD_TASTE);
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        toast.show({
          title: "権限エラー",
          description: "画像へのアクセス許可が必要です",
          status: "error"
        });
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
        
        // Firebase Storageに画像をアップロード
        setIsUploading(true);
        const uploadedUrl = await uploadImage(result.assets[0].uri);
        setIsUploading(false);
        
        if (uploadedUrl) {
          setPhotoURL(uploadedUrl);
          toast.show({
            title: "アップロード完了",
            description: "画像が正常にアップロードされました",
            status: "success"
          });
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      toast.show({
        title: "エラー",
        description: "画像の選択または処理に失敗しました",
        status: "error"
      });
      setIsUploading(false);
    }
  };
  
  // カメラで撮影する機能
  const handleCameraCapture = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        toast.show({
          title: "権限エラー",
          description: "カメラへのアクセス許可が必要です",
          status: "error"
        });
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
        
        // Firebase Storageに画像をアップロード
        setIsUploading(true);
        const uploadedUrl = await uploadImage(result.assets[0].uri);
        
        // 画像からコーヒー名を推測
        try {
          const mockResponse = {
            body: 'medium' as 'light' | 'medium' | 'heavy',
            flavor: ['fruity', 'nutty'],
            aftertaste: 'medium' as 'short' | 'medium' | 'long'
          };
          
          const languageResult = await generateLanguage(mockResponse);
          if (languageResult && languageResult.recommendations && languageResult.recommendations.length > 0) {
            const suggestion = languageResult.recommendations[0];
            setSuggestedName(suggestion);
            
            // 名前が設定されていない場合は自動で入力
            if (!name) {
              setName(suggestion);
            }
            
            toast.show({
              title: "推測されたコーヒー名",
              description: `画像から「${suggestion}」と推測されました`,
              status: "info"
            });
          }
        } catch (aiError) {
          console.error("Error generating coffee name:", aiError);
        }
        
        setIsUploading(false);
        
        if (uploadedUrl) {
          setPhotoURL(uploadedUrl);
          toast.show({
            title: "アップロード完了",
            description: "画像が正常にアップロードされました",
            status: "success"
          });
        }
      }
    } catch (error) {
      console.error("Error capturing image:", error);
      toast.show({
        title: "エラー",
        description: "カメラの使用または画像処理に失敗しました",
        status: "error"
      });
      setIsUploading(false);
    }
  };

  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <HStack px={4} py={2} alignItems="center" justifyContent="space-between">
        <Pressable onPress={handleBack} hitSlop={8} p={2}>
          <Icon as={Ionicons} name="arrow-back" size="md" color={COLORS.text.primary} />
        </Pressable>
        <Heading size="md">基本情報</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>

      <ScrollView flex={1} px={6} py={4}>
        <VStack space={6}>
          <Input
            label="コーヒー名"
            placeholder="例: エチオピア イルガチェフェ"
            value={name}
            onChangeText={setName}
            isRequired
          />
          
          {suggestedName && !name && (
            <Pressable 
              bg={COLORS.background.secondary} 
              px={3} 
              py={2} 
              rounded="md" 
              mt={1}
              onPress={() => setName(suggestedName)}
            >
              <HStack alignItems="center" space={2}>
                <Icon as={Ionicons} name="lightbulb-outline" size="sm" color={COLORS.primary[500]} />
                <Text fontSize="sm">
                  「{suggestedName}」を使用する
                </Text>
              </HStack>
            </Pressable>
          )}

          <Input
            label="焙煎所（任意）"
            placeholder="例: 丸山珈琲"
            value={roaster}
            onChangeText={setRoaster}
          />

          <VStack space={3}>
            <Text fontWeight="medium">写真（任意）</Text>
            
            {isUploading ? (
              <Box 
                borderWidth={1}
                borderColor={COLORS.text.light}
                borderStyle="dashed"
                rounded="lg"
                h={200}
                justifyContent="center"
                alignItems="center"
                bg={COLORS.background.secondary}
              >
                <VStack space={3} alignItems="center">
                  <Icon as={Ionicons} name="cloud-upload" size="3xl" color={COLORS.primary[500]} />
                  <Text color={COLORS.text.secondary}>アップロード中...</Text>
                </VStack>
              </Box>
            ) : imageUri ? (
              <Pressable 
                onPress={handleImagePick}
                borderWidth={1}
                borderColor={COLORS.primary[500]}
                borderStyle="solid"
                rounded="lg"
                h={200}
                overflow="hidden"
                position="relative"
              >
                <Image 
                  source={{ uri: imageUri }}
                  alt="コーヒー画像"
                  w="full"
                  h="full"
                  resizeMode="cover"
                />
                <Box 
                  position="absolute" 
                  bottom={0}
                  left={0}
                  right={0}
                  py={2}
                  bg="rgba(0,0,0,0.5)"
                  alignItems="center"
                >
                  <Text color="white" fontSize="sm">タップして画像を変更</Text>
                </Box>
              </Pressable>
            ) : (
              <HStack space={2} w="full">
                <Pressable 
                  onPress={handleImagePick}
                  borderWidth={1}
                  borderColor={COLORS.text.light}
                  borderStyle="dashed"
                  rounded="lg"
                  flex={1}
                  h={150}
                  justifyContent="center"
                  alignItems="center"
                  bg={COLORS.background.secondary}
                >
                  <VStack space={2} alignItems="center">
                    <Icon as={Ionicons} name="image" size="3xl" color={COLORS.primary[500]} />
                    <Text color={COLORS.text.secondary} textAlign="center">ギャラリーから選択</Text>
                  </VStack>
                </Pressable>
                
                <Pressable 
                  onPress={handleCameraCapture}
                  borderWidth={1}
                  borderColor={COLORS.text.light}
                  borderStyle="dashed"
                  rounded="lg"
                  flex={1}
                  h={150}
                  justifyContent="center"
                  alignItems="center"
                  bg={COLORS.background.secondary}
                >
                  <VStack space={2} alignItems="center">
                    <Icon as={Ionicons} name="camera" size="3xl" color={COLORS.primary[500]} />
                    <Text color={COLORS.text.secondary} textAlign="center">カメラで撮影</Text>
                  </VStack>
                </Pressable>
              </HStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      <Box px={6} py={4} bg={COLORS.background.primary}>
        <Button
          label="次へ"
          onPress={handleNext}
          isDisabled={!name || isUploading}
          opacity={!name || isUploading ? 0.5 : 1}
        />
      </Box>
    </Box>
  );
};

export default CoffeeInfoScreen;