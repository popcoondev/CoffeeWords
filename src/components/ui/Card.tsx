import React from 'react';
import { Box, IBoxProps } from 'native-base';
import { COLORS } from '../../constants/theme';

interface CardProps extends IBoxProps {
  variant?: 'default' | 'accent';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  ...props
}) => {
  let cardStyle = {};

  switch (variant) {
    case 'default':
      cardStyle = {
        bg: 'white',
      };
      break;
    case 'accent':
      cardStyle = {
        bg: COLORS.background.secondary,
      };
      break;
  }

  return (
    <Box
      p={4}
      rounded="xl"
      shadow={2}
      {...cardStyle}
      {...props}
    >
      {children}
    </Box>
  );
};