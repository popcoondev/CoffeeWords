import React from 'react';

const Card = ({ children, ...props }: any) => {
  return (
    <div data-testid="Card" {...props}>
      {children}
    </div>
  );
};

export { Card };