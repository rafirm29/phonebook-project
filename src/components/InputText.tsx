import React from 'react';
import styled from '@emotion/styled';
import { colors } from '@/shared/colors';

const Input = styled.input({
  padding: 8,
  border: 'none',
  borderBottom: `1px solid lightgrey`,
  outline: 'none',
  backgroundColor: 'white',
  transition: 'all 0.3s ease',
  ':focus': {
    borderBottom: `1.5px solid ${colors.primary_green}`,
  },
});

interface InputTextProps {
  value?: string;
}

export const InputText: React.FC<InputTextProps> = ({ value }) => {
  return <Input type="text" />;
};

export default InputText;
