'use client';

import React from 'react';
import styled from '@emotion/styled';
import Contact from '@/components/Contact';
import ContactLoading from '@/components/ContactLoading';
import { useContacts } from '@/context/ContactProvider';

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

const ContactListPage: React.FC = () => {
  const { loading, regularContacts, favoriteContacts } = useContacts();

  return (
    <>
      <Section>Favorites</Section>
      {loading && <ContactLoading />}
      {!loading && favoriteContacts.length === 0 ? (
        <Empty>No favorite contact(s) added yet</Empty>
      ) : (
        <>
          {favoriteContacts.map((contact) => (
            <Contact key={contact.id} contact={contact} />
          ))}
        </>
      )}
      <Section>Contacts</Section>
      {loading && <ContactLoading />}
      {regularContacts &&
        !loading &&
        regularContacts.map((contact) => (
          <Contact key={contact.id} contact={contact} />
        ))}
    </>
  );
};

export default ContactListPage;
