import React from 'react';

const Button = ({ label, onPress, ...props }: any) => {
  return (
    <div data-testid="Button" label={label} onClick={onPress} {...props}>
      {label}
    </div>
  );
};

export { Button };