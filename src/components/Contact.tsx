/** @jsxImportSource @emotion/react */

import { IContact } from '@/shared/interface';
import React, { useEffect, useState } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { FaHeart, FaCaretDown, FaEdit, FaTrash } from 'react-icons/fa';
import { useContacts } from '@/context/ContactProvider';
import { colors } from '@/shared/colors';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { GET_CONTACT, MUTATE_DELETE_CONTACT } from '@/services/contacts';
import { toast } from 'react-toastify';

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

const ExtraNumber = styled.span({
  opacity: 0.6,
  fontSize: 10,
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
  gap: 16,
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

const DeleteBtn = styled.button({
  cursor: 'pointer',
  border: `1px solid ${colors.danger}`,
  color: colors.danger,
  backgroundColor: 'white',
  height: 40,
  width: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
});

const Modal = styled.div({
  position: 'fixed',
  // height: '100vh',
  width: 250,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 20,
  backgroundColor: 'white',
  padding: 16,
  borderRadius: 8,
  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
  touchAction: 'none',
});

const ModalText = styled.p({
  textAlign: 'center',
  width: '100%',
  fontSize: 16,
  marginBottom: 8,
});

const ModalBtn = styled.button({
  padding: 16,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  color: colors.danger,
  fontWeight: 'bold',
  width: '50%',
  border: `1px solid ${colors.danger}`,
  outline: 'none',
  borderRadius: 6,
  fontSize: 16,
});

interface ContactProps {
  contact: IContact;
}

export const Contact: React.FC<ContactProps> = ({ contact }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { favoriteContacts, addToFavorites, removeFromFavorites } =
    useContacts();

  const [deleteContact, deleteContactData] = useMutation(MUTATE_DELETE_CONTACT);
  if (deleteContactData.loading) console.log('Deleting'); // TODO: Implement loading
  if (deleteContactData.error) console.error(deleteContactData.error);
  if (deleteContactData.data) {
    toast.success('Successfully delete contact!', {
      position: 'top-right',
    });
    deleteContactData.data = null;
  }

  const handleDelete = (id: number) => {
    deleteContact({
      variables: {
        id,
      },
      refetchQueries: [{ query: GET_CONTACT }],
    });

    setIsModalOpen(false);
  };

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
        <Image src={'/img/avatar-2.png'} alt="Avatar" height={40} width={40} />
        <div>
          <p>
            {contact.first_name} {contact.last_name}
          </p>
          <PhoneText>
            {contact.phones[0].number}{' '}
            <ExtraNumber>
              {contact.phones.length > 1 &&
                `+${contact.phones.length - 1} other number(s)`}
            </ExtraNumber>
          </PhoneText>
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
        <DeleteBtn onClick={() => setIsModalOpen(true)}>
          <FaTrash />
        </DeleteBtn>
      </DropdownContent>
      {isModalOpen && (
        <Modal>
          <ModalText>
            Are you sure you want to delete &quot;{contact.first_name}{' '}
            {contact.last_name}&quot; from your contact list?
          </ModalText>
          <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModalBtn onClick={() => setIsModalOpen(false)}>Cancel</ModalBtn>
            <ModalBtn
              css={{ backgroundColor: colors.danger, color: 'white' }}
              onClick={() => handleDelete(contact.id)}
            >
              Delete
            </ModalBtn>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Contact;
