import React from 'react';
import { Box, Center, Spinner, Text, VStack } from 'native-base';
import { COLORS } from '../constants/theme';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'アプリを準備しています...' 
}) => {
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <Center flex={1}>
        <VStack space={4} alignItems="center">
          <Spinner size="lg" color={COLORS.primary[500]} />
          <Text color={COLORS.text.secondary}>{message}</Text>
        </VStack>
      </Center>
    </Box>
  );
};

export default LoadingScreen;