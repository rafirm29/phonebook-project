'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CONTACT, ContactResult } from '@/services/contacts';
import styled from '@emotion/styled';
import Skeleton from 'react-loading-skeleton';
import Contact from '@/components/Contact';
import ContactLoading from '@/components/ContactLoading';

const Section = styled.div({
  fontSize: 24,
  fontWeight: 'bold',
});

const ContactListPage: React.FC = () => {
  const { loading, error, data } = useQuery<ContactResult>(GET_CONTACT);

  return (
    <>
      <Section>Favorites</Section>
      {loading && <ContactLoading />}
      <Section>Contacts</Section>
      {loading && <ContactLoading />}
      {data &&
        !loading &&
        data.contact.map((contact) => (
          <Contact key={contact.id} contact={contact} />
        ))}
    </>
  );
};

export default ContactListPage;
