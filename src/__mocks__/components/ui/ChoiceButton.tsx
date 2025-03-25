import React from 'react';

const ChoiceButton = ({ label, onPress, isSelected, description, icon, ...props }: any) => {
  return (
    <div 
      data-testid="ChoiceButton" 
      label={label} 
      onClick={onPress} 
      isSelected={isSelected}
      description={description}
      icon={icon}
      {...props}
    >
      {label}
    </div>
  );
};

export { ChoiceButton };