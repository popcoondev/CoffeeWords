import React, { useState } from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';
import { Box, VStack, Heading, Text, FormControl, Button, HStack, Icon, Pressable, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Input } from '../../components/ui/Input';
import { COLORS } from '../../constants/theme';
import { ROUTES } from '../../constants/routes';
import { useExplorationStore } from '../../store/useExplorationStore';
import { useCoffeeStorage } from '../../hooks/useCoffeeStorage';
import { ScreenProps } from '../../types';

/**
 * 探検情報入力画面
 * コーヒーの基本情報（名前、焙煎所、産地）と写真を入力する
 */
const ExplorationInfoScreen: React.FC = () => {
  const navigation = useNavigation();
  const toast = useToast();
  
  // Exploration Store
  const { coffeeInfo, setCoffeeInfo } = useExplorationStore();
  
  // Firebase連携のためのフック
  const { uploadImage, loading: uploading } = useCoffeeStorage();
  
  // ローカルステート
  const [imageUri, setImageUri] = useState<string | null>(coffeeInfo.photoURL || null);
  const [isUploading, setIsUploading] = useState(false);
  
  // 戻るボタン
  const handleBack = () => {
    navigation.goBack();
  };
  
  // 次へボタン
  const handleNext = () => {
    // 次のステップに進む（味わいマップ画面）
    navigation.navigate(ROUTES.EXPLORATION_TASTE_MAP, { coffeeInfo });
  };
  
  // 画像選択
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
          setCoffeeInfo({ photoURL: uploadedUrl });
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
  
  // カメラ撮影
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
        setIsUploading(false);
        
        if (uploadedUrl) {
          setCoffeeInfo({ photoURL: uploadedUrl });
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
        <Heading size="md">コーヒー情報</Heading>
        <Box w={10} /> {/* バランスを取るための空のボックス */}
      </HStack>
      
      <ScrollView flex={1} px={6} py={4}>
        <VStack space={6}>
          <FormControl isRequired isInvalid={!coffeeInfo.name.trim()}>
            <FormControl.Label _text={{ color: COLORS.text.primary }}>
              コーヒー名
            </FormControl.Label>
            <Input
              placeholder="例: エチオピア イルガチェフェ"
              value={coffeeInfo.name}
              onChangeText={(value) => setCoffeeInfo({ name: value })}
            />
            {!coffeeInfo.name.trim() && (
              <FormControl.ErrorMessage>
                コーヒー名は必須です
              </FormControl.ErrorMessage>
            )}
          </FormControl>
          
          <FormControl>
            <FormControl.Label _text={{ color: COLORS.text.primary }}>
              焙煎所（任意）
            </FormControl.Label>
            <Input
              placeholder="例: 丸山珈琲"
              value={coffeeInfo.roaster}
              onChangeText={(value) => setCoffeeInfo({ roaster: value })}
            />
          </FormControl>
          
          <FormControl>
            <FormControl.Label _text={{ color: COLORS.text.primary }}>
              原産地（任意）
            </FormControl.Label>
            <Input
              placeholder="例: エチオピア イルガチェフェ地区"
              value={coffeeInfo.origin}
              onChangeText={(value) => setCoffeeInfo({ origin: value })}
            />
          </FormControl>
          
          <VStack space={3}>
            <Text fontWeight="medium" color={COLORS.text.primary}>
              写真（任意）
            </Text>
            
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
                  style={styles.image}
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
                    <Text color={COLORS.text.secondary} textAlign="center">
                      ギャラリーから選択
                    </Text>
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
                    <Text color={COLORS.text.secondary} textAlign="center">
                      カメラで撮影
                    </Text>
                  </VStack>
                </Pressable>
              </HStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>
      
      <Box px={6} py={4} bg={COLORS.background.primary} borderTopWidth={1} borderTopColor={COLORS.background.secondary}>
        <Button
          onPress={handleNext}
          isDisabled={!coffeeInfo.name.trim() || isUploading}
          bg={COLORS.primary[500]}
          _pressed={{ bg: COLORS.primary[600] }}
          _text={{ color: 'white' }}
        >
          次へ
        </Button>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ExplorationInfoScreen;