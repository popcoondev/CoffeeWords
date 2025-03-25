import React from 'react';

const Tag = ({ label, onRemove, ...props }: any) => {
  return (
    <div data-testid="Tag" label={label} onClick={onRemove} {...props}>
      {label}
    </div>
  );
};

export { Tag };