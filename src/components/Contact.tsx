import { IContact } from '@/shared/interface';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { useContacts } from '@/context/ContactProvider';

const ContactContainer = styled.div`
  padding: 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PhoneText = styled.p({
  fontSize: 12,
  color: 'gray',
});

const FavoriteButton = styled.button({
  padding: 8,
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
});

interface ContactProps {
  contact: IContact;
}

export const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { favoriteContacts, addToFavorites, removeFromFavorites } =
    useContacts();

  useEffect(() => {
    const currentContact = favoriteContacts.find((c) => c.id === contact.id);

    if (currentContact) {
      setIsFavorite(true);
    }
  }, [favoriteContacts]);

  return (
    <ContactContainer>
      <Image src={'/img/avatar.png'} alt="Avatar" height={40} width={40} />
      <div>
        <p>
          {contact.first_name} {contact.last_name}
        </p>
        <PhoneText>{contact.phones[0].number}</PhoneText>
      </div>
      <FavoriteButton
        style={{ color: `${isFavorite ? 'red' : 'dimgray'}` }}
        onClick={() =>
          isFavorite
            ? removeFromFavorites(contact.id)
            : addToFavorites(contact.id)
        }
      >
        <FaHeart />
      </FavoriteButton>
    </ContactContainer>
  );
};

export default Contact;
