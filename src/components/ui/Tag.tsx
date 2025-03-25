import React from 'react';
import { HStack, Text, Pressable, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

interface TagProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'outline';
}

export const Tag: React.FC<TagProps> = ({
  label,
  onRemove,
  variant = 'default',
}) => {
  const bgColor = variant === 'default' ? COLORS.secondary[500] : 'transparent';
  const borderWidth = variant === 'outline' ? 1 : 0;
  const borderColor = variant === 'outline' ? COLORS.primary[500] : 'transparent';
  
  return (
    <HStack
      alignItems="center"
      bg={bgColor}
      borderWidth={borderWidth}
      borderColor={borderColor}
      rounded="full"
      px={3}
      py={1}
      mr={2}
      mb={2}
    >
      <Text
        fontSize="xs"
        fontWeight="medium"
        color={COLORS.text.primary}
      >
        {label}
      </Text>
      
      {onRemove && (
        <Pressable
          onPress={onRemove}
          ml={1}
          _pressed={{ opacity: 0.7 }}
        >
          <Icon
            as={Ionicons}
            name="close-circle"
            size="xs"
            color={COLORS.text.secondary}
          />
        </Pressable>
      )}
    </HStack>
  );
};