import React, { useState } from 'react';
import { Box, VStack, Heading, Icon, HStack, Pressable, Text, ScrollView } from 'native-base';
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

type CoffeeInfoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoffeeRecordFlow'>;

const CoffeeInfoScreen: React.FC = () => {
  const navigation = useNavigation<CoffeeInfoNavigationProp>();
  const { name, roaster, photoURL, setName, setRoaster, uploadPhoto } = useCoffeeRecord();
  const [imageUri, setImageUri] = useState<string | null>(photoURL);
  const [isUploading, setIsUploading] = useState(false);

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
        alert("画像へのアクセス許可が必要です");
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
        
        // 実際の実装では画像をアップロードする
        // setIsUploading(true);
        // await uploadPhoto(result.assets[0].uri);
        // setIsUploading(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("画像の選択に失敗しました");
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

          <Input
            label="焙煎所（任意）"
            placeholder="例: 丸山珈琲"
            value={roaster}
            onChangeText={setRoaster}
          />

          <VStack space={3}>
            <Text fontWeight="medium">写真（任意）</Text>
            <Pressable 
              onPress={handleImagePick}
              borderWidth={1}
              borderColor={COLORS.text.light}
              borderStyle="dashed"
              rounded="lg"
              h={200}
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
              bg={imageUri ? "transparent" : COLORS.background.secondary}
              position="relative"
            >
              {imageUri ? (
                <Box position="relative" w="full" h="full">
                  <Box 
                    position="absolute" 
                    w="full" 
                    h="full" 
                    zIndex={1}
                    bgColor="rgba(0,0,0,0.2)"
                  />
                  {/* 実際の実装ではキャッシュから取得した画像を表示 */}
                  <Icon 
                    as={Ionicons} 
                    name="image" 
                    size="5xl" 
                    color="white" 
                    position="absolute"
                    top="50%"
                    left="50%"
                    marginTop="-20px"
                    marginLeft="-20px"
                    zIndex={2}
                  />
                </Box>
              ) : (
                <VStack space={2} alignItems="center">
                  <Icon as={Ionicons} name="camera" size="3xl" color={COLORS.primary[500]} />
                  <Text color={COLORS.text.secondary}>タップして写真を追加</Text>
                </VStack>
              )}
            </Pressable>
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