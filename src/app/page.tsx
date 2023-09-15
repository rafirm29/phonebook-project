'use client';

import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Contact from '@/components/Contact';
import ContactLoading from '@/components/ContactLoading';
import { useContacts } from '@/context/ContactProvider';
import { useQuery } from '@apollo/client';
import { ContactResult, GET_CONTACT } from '@/services/contacts';
import { IContact } from '@/shared/interface';

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
  const { favoriteContacts } = useContacts();
  const { loading, error, data } = useQuery<ContactResult>(GET_CONTACT);

  const [favorites, setFavorites] = useState<IContact[]>([]);

  useEffect(() => {
    const favoriteContact = data?.contact.filter((contact) =>
      favoriteContacts.includes(contact.id)
    );
    if ((favoriteContact?.length as number) > 0 && favoriteContact)
      setFavorites([...favoriteContact]);
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
        data.contact
          .filter((c) => !favoriteContacts.includes(c.id))
          .map((contact) => <Contact key={contact.id} contact={contact} />)}
    </>
  );
};

export default ContactListPage;
