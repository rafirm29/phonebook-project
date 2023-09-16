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
import { FaPlus } from 'react-icons/fa';
import SearchBarComponent from '@/components/SearchBar';

const Container = styled.div({
  padding: 16,
});

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
  cursor: 'pointer',
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

const AddContact = styled.button({
  cursor: 'pointer',
  width: 'calc(100% - 16px)',
  margin: 8,
  outline: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '12px 8px',
  fontWeight: 'bold',
  fontSize: 16,
  gap: 8,
  color: colors.secondary_blue,
  border: `1px solid ${colors.secondary_blue}`,
  borderRadius: 6,
  backgroundColor: 'white',
  transition: 'all 0.3s ease',
  ':hover': {
    color: 'white',
    backgroundColor: colors.secondary_blue,
  },
});

const ContactListPage: React.FC = () => {
  const { favoriteContacts, setAllContacts } = useContacts();
  const { loading, error, data, refetch } =
    useQuery<ContactResult>(GET_CONTACT);

  const router = useRouter();

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

  // Search debounce
  const [searchQuery, setSearchQuery] = useState('');

  const refecthGetContact = () => {
    refetch({
      where: {
        _or: [
          { first_name: { _like: `%${searchQuery}%` } },
          { last_name: { _like: `%${searchQuery}%` } },
        ],
      },
    });
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      refetch({
        where: {
          _or: [
            { first_name: { _ilike: `%${searchQuery}%` } },
            { last_name: { _ilike: `%${searchQuery}%` } },
          ],
        },
      });
    }, 500);

    return () => {
      clearTimeout(debounceSearch);
    };
  }, [searchQuery]);

  useEffect(() => {
    // Update all contacts context
    setAllContacts(data?.contact || []);

    // Update favorite contacts
    const favoriteContact = data?.contact.filter((contact) =>
      favoriteContacts.includes(contact.id)
    );
    if ((favoriteContact?.length as number) > 0 && favoriteContact) {
      setFavorites([...favoriteContact]);
    } else setFavorites([]);
  }, [favoriteContacts, data]);

  return (
    <Container>
      {/* TODO: Add section per alphabet */}
      <SearchBarComponent
        onChange={(e) => setSearchQuery(e.target.value)}
        value={searchQuery}
      />
      <Section>Favorites</Section>
      {loading && <ContactLoading />}
      {!loading && favorites.length === 0 ? (
        <Empty>No favorite contact(s) added yet</Empty>
      ) : (
        <>
          {favorites.map((contact) => (
            <Contact
              key={contact.id}
              contact={contact}
              onDelete={() => refecthGetContact()}
            />
          ))}
        </>
      )}
      <Section>Contacts</Section>
      {loading && <ContactLoading />}
      {data && !loading && contactsToDisplay.length === 0 ? (
        <Empty>No contact</Empty>
      ) : (
        contactsToDisplay
          .filter((c) => !favoriteContacts.includes(c.id))
          .map((contact) => (
            <Contact
              key={contact.id}
              contact={contact}
              onDelete={() => refecthGetContact()}
            />
          ))
      )}
      {renderPageNumbers()}
      <AddContact onClick={() => router.push('/contact')}>
        <FaPlus />
        Add Contact
      </AddContact>
    </Container>
  );
};

export default ContactListPage;
