// Native Baseのモック
import React from 'react';

// Native Baseのコンポーネントをモック
const createMockComponent = (name: string) => {
  const component = ({ children, ...props }: any) => <div data-testid={name} {...props}>{children}</div>;
  component.displayName = name;
  return component;
};

// Native Baseのフックをモック
export const useToast = jest.fn().mockReturnValue({
  show: jest.fn(),
  close: jest.fn(),
  closeAll: jest.fn(),
});

export const useTheme = jest.fn().mockReturnValue({
  colors: {
    primary: {
      500: '#3498db',
    },
    text: {
      primary: '#000000',
      secondary: '#666666',
      light: '#999999',
    },
    background: {
      primary: '#ffffff',
    },
  },
});

// Native Baseのコンポーネント
export const Box = createMockComponent('Box');
export const Button = createMockComponent('Button');
export const Center = createMockComponent('Center');
export const HStack = createMockComponent('HStack');
export const VStack = createMockComponent('VStack');
export const Text = createMockComponent('Text');
export const Input = createMockComponent('Input');
export const Image = createMockComponent('Image');
export const ScrollView = createMockComponent('ScrollView');
export const Heading = createMockComponent('Heading');
export const Pressable = createMockComponent('Pressable');
export const Spinner = createMockComponent('Spinner');
export const Icon = createMockComponent('Icon');
export const Modal = {
  ...createMockComponent('Modal'),
  Header: createMockComponent('Modal.Header'),
  Body: createMockComponent('Modal.Body'),
  Footer: createMockComponent('Modal.Footer'),
  Content: createMockComponent('Modal.Content'),
  CloseButton: createMockComponent('Modal.CloseButton'),
};
export const FormControl = {
  ...createMockComponent('FormControl'),
  Label: createMockComponent('FormControl.Label'),
  ErrorMessage: createMockComponent('FormControl.ErrorMessage'),
  HelperText: createMockComponent('FormControl.HelperText'),
};
export const Divider = createMockComponent('Divider');
export const Card = createMockComponent('Card');