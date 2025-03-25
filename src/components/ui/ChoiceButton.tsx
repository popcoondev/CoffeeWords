import React from 'react';
import { Pressable, Text, Icon, HStack, VStack } from 'native-base';
import { COLORS } from '../../constants/theme';

interface ChoiceButtonProps {
  label: string;
  icon?: string;
  isSelected: boolean;
  onPress: () => void;
  description?: string;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  label,
  icon,
  isSelected,
  onPress,
  description,
}) => {
  return (
    <Pressable
      onPress={onPress}
      bg={isSelected ? COLORS.secondary[500] : '#F0F0F0'}
      borderWidth={isSelected ? 1 : 0}
      borderColor={isSelected ? COLORS.primary[500] : 'transparent'}
      rounded="md"
      p={4}
      mb={2}
      _pressed={{
        opacity: 0.8,
      }}
    >
      <HStack space={3} alignItems="center">
        {icon && (
          <Text fontSize="xl">{icon}</Text>
        )}
        <VStack flex={1}>
          <Text
            fontWeight="medium"
            color={COLORS.text.primary}
          >
            {label}
          </Text>
          
          {description && (
            <Text
              fontSize="xs"
              color={COLORS.text.secondary}
              mt={1}
            >
              {description}
            </Text>
          )}
        </VStack>
        
        {isSelected && (
          <Icon
            name="checkmark-circle"
            size="md"
            color={COLORS.primary[500]}
          />
        )}
      </HStack>
    </Pressable>
  );
};