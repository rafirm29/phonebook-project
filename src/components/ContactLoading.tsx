import styled from '@emotion/styled';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const LoadingContainer = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  div {
    min-width: 75%;
    max-width: 100px;
  }
`;

const ContactLoading: React.FC = () => {
  return (
    <LoadingContainer>
      <Skeleton circle height={40} width={40} />
      <div>
        <Skeleton />
        <Skeleton />
      </div>
    </LoadingContainer>
  );
};

export default ContactLoading;
