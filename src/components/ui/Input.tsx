import React from 'react';
import { Input as NBInput, IInputProps, FormControl, Text } from 'native-base';
import { COLORS } from '../../constants/theme';

interface CustomInputProps extends IInputProps {
  label?: string;
  error?: string;
  helper?: string;
  isRequired?: boolean;
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  error,
  helper,
  isRequired = false,
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
      
      <NBInput
        height="48px"
        borderColor={COLORS.text.light}
        _focus={{
          borderColor: COLORS.primary[500],
          bg: 'white',
        }}
        fontSize="md"
        {...props}
      />
      
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