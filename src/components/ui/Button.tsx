import React from 'react';
import { Button as NBButton, IButtonProps, Text } from 'native-base';
import { COLORS } from '../../constants/theme';

interface CustomButtonProps extends IButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  label: string;
}

export const Button: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  label,
  ...props
}) => {
  let buttonStyle = {};
  let textStyle = {};

  switch (variant) {
    case 'primary':
      buttonStyle = {
        bg: COLORS.primary[500],
        _pressed: { bg: COLORS.primary[600] },
      };
      textStyle = { color: 'white' };
      break;
    case 'secondary':
      buttonStyle = {
        bg: COLORS.secondary[500],
        _pressed: { bg: COLORS.secondary[600] },
      };
      textStyle = { color: COLORS.text.primary };
      break;
    case 'outline':
      buttonStyle = {
        bg: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary[500],
        _pressed: { bg: COLORS.primary[50] },
      };
      textStyle = { color: COLORS.primary[500] };
      break;
    case 'ghost':
      buttonStyle = {
        bg: 'transparent',
        _pressed: { bg: 'transparent', opacity: 0.7 },
      };
      textStyle = { color: COLORS.primary[500] };
      break;
  }

  return (
    <NBButton
      height="48px"
      rounded="md"
      {...buttonStyle}
      {...props}
    >
      <Text fontSize="md" fontWeight="medium" {...textStyle}>
        {label}
      </Text>
    </NBButton>
  );
};