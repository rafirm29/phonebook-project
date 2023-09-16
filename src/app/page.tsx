/** @jsxImportSource @emotion/react */
'use client';

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Contact from '@/components/Contact';
import ContactLoading from '@/components/ContactLoading';
import { useContacts } from '@/context/ContactProvider';
import { useQuery } from '@apollo/client';
import { ContactResult, GET_CONTACT } from '@/services/contacts';
import { IContact } from '@/shared/interface';
import { useRouter } from 'next/navigation';
import { colors } from '@/shared/colors';

const Section = styled.div({
  fontSize: 24,
  fontWeight: 'bold',
});

const Empty = styled.div({
  padding: 16,
  height: 72,
  fontSize: 14,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: 'lightgray',
});

const Pagination = styled.div({
  margin: '8px 0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
});

const Page = styled.button({
  outline: 'none',
  border: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 6,
  fontSize: 14,
  backgroundColor: 'white',
  color: colors.primary_green,
  borderRadius: '50%',
  height: 30,
  width: 30,
});

const ContactListPage: React.FC = () => {
  const { favoriteContacts } = useContacts();
  const { loading, error, data } = useQuery<ContactResult>(GET_CONTACT);

  const [favorites, setFavorites] = useState<IContact[]>([]);

  const regularContacts =
    data?.contact.filter((c) => !favoriteContacts.includes(c.id)) || [];
  const itemsPerPage = 10;

  // Pagination
  const totalPages = Math.ceil(regularContacts.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const renderPageNumbers = () => {
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );

    return (
      <Pagination>
        {pageNumbers.map((pageNumber) => (
          <Page
            key={pageNumber}
            onClick={() => setCurrentPage(pageNumber)}
            css={
              currentPage === pageNumber && {
                color: 'white',
                backgroundColor: colors.primary_green,
              }
            }
          >
            {pageNumber}
          </Page>
        ))}
      </Pagination>
    );
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const contactsToDisplay = regularContacts.slice(startIdx, endIdx);

  useEffect(() => {
    console.log('favorite change detected');
    const favoriteContact = data?.contact.filter((contact) =>
      favoriteContacts.includes(contact.id)
    );
    if ((favoriteContact?.length as number) > 0 && favoriteContact) {
      setFavorites([...favoriteContact]);
    } else setFavorites([]);
  }, [favoriteContacts, data]);

  return (
    <>
      <Section>Favorites</Section>
      {loading && <ContactLoading />}
      {!loading && favorites.length === 0 ? (
        <Empty>No favorite contact(s) added yet</Empty>
      ) : (
        <>
          {favorites.map((contact) => (
            <Contact key={contact.id} contact={contact} />
          ))}
        </>
      )}
      <Section>Contacts</Section>
      {loading && <ContactLoading />}
      {data &&
        !loading &&
        contactsToDisplay
          .filter((c) => !favoriteContacts.includes(c.id))
          .map((contact) => <Contact key={contact.id} contact={contact} />)}
      {renderPageNumbers()}
    </>
  );
};

export default ContactListPage;
