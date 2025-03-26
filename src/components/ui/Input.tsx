import React from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';
import { FormControl, Text, Box } from 'native-base';
import { COLORS } from '../../constants/theme';
import type { IInputProps } from 'native-base';

interface CustomInputProps extends Omit<IInputProps, 'onChangeText'> {
  label?: string;
  error?: string;
  helper?: string;
  isRequired?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  error,
  helper,
  isRequired = false,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  ...props
}) => {
  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      {label && (
        <FormControl.Label>
          <Text fontWeight="medium" color={COLORS.text.primary}>
            {label}
          </Text>
        </FormControl.Label>
      )}
      
      <Box 
        borderWidth={1} 
        borderRadius="md"
        borderColor={error ? COLORS.error : COLORS.text.light}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </Box>
      
      {error && (
        <FormControl.ErrorMessage>
          {error}
        </FormControl.ErrorMessage>
      )}
      
      {helper && !error && (
        <FormControl.HelperText>
          {helper}
        </FormControl.HelperText>
      )}
    </FormControl>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: COLORS.text.primary,
    width: '100%',
  }
});