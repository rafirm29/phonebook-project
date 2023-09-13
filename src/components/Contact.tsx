import { IContact } from '@/shared/interface';
import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';

const ContactContainer = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface ContactProps {
  contact: IContact;
}

export const Contact: React.FC<ContactProps> = ({ contact }) => {
  return (
    <ContactContainer>
      <Image src={'/img/avatar.png'} alt="Avatar" height={40} width={40} />
      <div>
        <p>{contact.first_name}</p>
        <p>{contact.phones[0].number}</p>
      </div>
    </ContactContainer>
  );
};

export default Contact;
