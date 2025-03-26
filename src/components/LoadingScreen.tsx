import React, { useEffect, useState } from 'react';
import { Box, Center, Spinner, Text, VStack, ScrollView } from 'native-base';
import { COLORS } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';

interface LoadingScreenProps {
  message?: string;
  showDebug?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'アプリを準備しています...', 
  showDebug = true
}) => {
  const { error } = useAuthStore();
  const [logs, setLogs] = useState<string[]>([]);
  
  // コンソールログをキャプチャするための関数
  useEffect(() => {
    if (!showDebug) return;
    
    // コンソールログをキャプチャするロジックをレンダリング後に実行
    const timer = setTimeout(() => {
      // 元のコンソールログを保存
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      // ログをキャプチャする関数
      const captureLog = (type: string, ...args: any[]) => {
        const logMessage = `[${type}] ${args.map(arg => 
          typeof arg === 'string' ? arg : 
          (arg instanceof Error ? arg.message : 
          JSON.stringify(arg))).join(' ')}`;
        
        setLogs(prev => [...prev, logMessage].slice(-20)); // 最新20件のみ保持
        
        // 元のコンソール関数を呼び出す
        if (type === 'ERROR') {
          originalConsoleError(...args);
        } else {
          originalConsoleLog(...args);
        }
      };
      
      // コンソール関数をオーバーライド
      console.log = (...args) => captureLog('LOG', ...args);
      console.error = (...args) => captureLog('ERROR', ...args);
      
      // クリーンアップ関数を返す
      return () => {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
      };
    }, 0);
    
    return () => clearTimeout(timer);
  }, [showDebug]);
  
  return (
    <Box flex={1} bg={COLORS.background.primary} safeArea>
      <Center flex={1}>
        <VStack space={4} alignItems="center" maxWidth="90%">
          <Spinner size="lg" color={COLORS.primary[500]} />
          <Text color={COLORS.text.secondary}>{message}</Text>
          
          {error && (
            <Text color="red.500" mt={2}>
              エラー: {error}
            </Text>
          )}
          
          {showDebug && logs.length > 0 && (
            <Box mt={6} p={3} bg="coolGray.800" borderRadius="md" width="100%" maxHeight="50%">
              <Text color="white" fontSize="xs" mb={2}>デバッグ情報:</Text>
              <ScrollView>
                {logs.map((log, i) => (
                  <Text key={i} color="white" fontSize="2xs" mb={1}>
                    {log}
                  </Text>
                ))}
              </ScrollView>
            </Box>
          )}
        </VStack>
      </Center>
    </Box>
  );
};

export default LoadingScreen;