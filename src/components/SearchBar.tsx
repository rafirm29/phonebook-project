/** @jsxImportSource @emotion/react */

import React from 'react';
import styled from '@emotion/styled';
import { colors } from '@/shared/colors';
import { FaSearch } from 'react-icons/fa';

const Searchbar = styled.div({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const SearchbarInput = styled.input({
  padding: 12,
  paddingLeft: 32,
  margin: '6px 0',
  width: '100%',
  border: `1px solid lightgrey`,
  outline: 'none',
  backgroundColor: 'white',
  transition: 'all 0.3s ease',
  borderRadius: 6,
  '+ svg': {
    transition: 'all 0.3s ease',
  },
  ':focus': {
    border: `1.5px solid ${colors.primary_green}`,
    '+ svg': {
      color: colors.primary_green,
    },
  },
  '::placeholder': {
    color: 'lightgray',
    opacity: '1',
  },
});

interface SearchBarProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
}

export const SearchBarComponent: React.FC<SearchBarProps> = ({
  onChange,
  value,
}) => {
  return (
    <Searchbar>
      <SearchbarInput
        placeholder="Search contact"
        onChange={onChange}
        value={value}
      />
      <FaSearch css={{ position: 'absolute', left: 8 }} />
    </Searchbar>
  );
};

export default SearchBarComponent;
