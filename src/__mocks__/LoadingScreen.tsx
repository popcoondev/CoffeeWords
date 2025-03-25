import React from 'react';
import { Box, Center, Spinner, Text, VStack } from 'native-base';

const LoadingScreen = ({ message = 'アプリを準備しています...' }) => {
  return (
    <Box data-testid="Box" flex={1}>
      <Center flex={1}>
        <VStack space={4} alignItems="center">
          <Spinner data-testid="Spinner" size="lg" />
          <Text>{message}</Text>
        </VStack>
      </Center>
    </Box>
  );
};

export default LoadingScreen;