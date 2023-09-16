/** @jsxImportSource @emotion/react */

import { IContact } from '@/shared/interface';
import React, { useEffect, useState } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { FaHeart, FaCaretDown, FaEdit } from 'react-icons/fa';
import { useContacts } from '@/context/ContactProvider';
import { colors } from '@/shared/colors';
import Link from 'next/link';

const ContactContainer = styled.div`
  padding: 16px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PhoneText = styled.p({
  fontSize: 12,
  color: 'gray',
});

const FavoriteButton = styled.button({
  padding: 8,
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
  border: 'none',
  cursor: 'pointer',
});

const DropdownArrow = styled.div({
  padding: 8,
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  transition: 'transform 0.3s',
});

const DropdownContent = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 72,
});

const editBtnStyle = css({
  cursor: 'pointer',
  border: `1px solid ${colors.secondary_blue}`,
  color: colors.secondary_blue,
  backgroundColor: 'white',
  height: 40,
  width: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
});

interface ContactProps {
  contact: IContact;
}

export const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { favoriteContacts, addToFavorites, removeFromFavorites } =
    useContacts();

  useEffect(() => {
    const currentContact = favoriteContacts.find((cid) => cid === contact.id);

    if (currentContact) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favoriteContacts]);

  return (
    <>
      <ContactContainer
        onClick={() => setIsOpen(!isOpen)}
        css={css({
          borderRadius: `${isOpen ? '8px 8px 0 0' : '8px'}`,
          borderBottom: `${isOpen ? 'none' : '1px solid lightgrey'}`,
        })}
      >
        <FavoriteButton
          css={css({ color: `${isFavorite ? 'red' : 'dimgray'}` })}
          onClick={() =>
            isFavorite
              ? removeFromFavorites(contact.id)
              : addToFavorites(contact.id)
          }
        >
          <FaHeart />
        </FavoriteButton>
        <Image src={'/img/avatar.png'} alt="Avatar" height={40} width={40} />
        <div>
          <p>
            {contact.first_name} {contact.last_name}
          </p>
          <PhoneText>{contact.phones[0].number}</PhoneText>
        </div>
        <DropdownArrow
          css={{ transform: `${isOpen ? 'rotate(180deg)' : 'rotate(0)'}` }}
        >
          <FaCaretDown />
        </DropdownArrow>
      </ContactContainer>
      <DropdownContent
        css={css({
          display: `${isOpen ? 'flex' : 'none'}`,
          borderBottom: `${isOpen ? '1px solid lightgrey' : 'none'}`,
          animation: 'menuOpen 2s ease-in-out',
        })}
      >
        <Link href={`/contact?user_id=${contact.id}`} css={editBtnStyle}>
          <FaEdit css={{ marginLeft: 3 }} />
        </Link>
      </DropdownContent>
    </>
  );
};

export default Contact;
