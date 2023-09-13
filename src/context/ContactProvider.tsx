import { ContactResult, GET_CONTACT } from '@/services/contacts';
import { IContact } from '@/shared/interface';
import { useQuery } from '@apollo/client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContactProviderProps {
  children: React.ReactNode;
}

interface IContactContext {
  regularContacts: IContact[];
  favoriteContacts: IContact[];
  loading: boolean;
  addToFavorites: (contactId: number) => void;
  removeFromFavorites: (contactId: number) => void;
}

const ContactsContext = createContext<IContactContext>({} as IContactContext);

export const useContacts = () => {
  return useContext<IContactContext>(ContactsContext);
};

const ContactsProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [regularContacts, setRegularContacts] = useState<IContact[]>([]);
  const [favoriteContacts, setFavoriteContacts] = useState<IContact[]>([]);
  const { loading, error, data } = useQuery<ContactResult>(GET_CONTACT);

  const sortContacts = (contacts: IContact[]) => {
    return contacts
      .slice()
      .sort((a, b) => a.first_name.localeCompare(b.first_name));
  };

  const addToFavorites = (contactId: number) => {
    console.log('Adding');
    const contact = regularContacts.find((c) => c.id === contactId);

    if (contact) {
      const updatedRegularContacts = regularContacts.filter(
        (c) => c.id !== contactId
      );
      const updatedFavoriteContacts = sortContacts([
        ...favoriteContacts,
        contact,
      ]);
      setRegularContacts(sortContacts(updatedRegularContacts));
      setFavoriteContacts(updatedFavoriteContacts);

      localStorage.setItem(
        'contact_list',
        JSON.stringify(updatedRegularContacts)
      );
      localStorage.setItem(
        'favorite_list',
        JSON.stringify(updatedFavoriteContacts)
      );
    }
  };

  const removeFromFavorites = (contactId: number) => {
    const contact = favoriteContacts.find((c) => c.id === contactId);

    if (contact) {
      const updatedFavoriteContacts = favoriteContacts.filter(
        (c) => c.id !== contactId
      );
      const updatedRegularContacts = sortContacts([
        ...regularContacts,
        contact,
      ]);
      setFavoriteContacts(sortContacts(updatedFavoriteContacts));
      setRegularContacts(updatedRegularContacts);

      localStorage.setItem(
        'contact_list',
        JSON.stringify(updatedRegularContacts)
      );
      localStorage.setItem(
        'favorite_list',
        JSON.stringify(updatedFavoriteContacts)
      );
    }
  };

  useEffect(() => {
    // Get from local storage if exists
    if (localStorage.getItem('contact_list')) {
      setRegularContacts(
        JSON.parse(localStorage.getItem('contact_list') as string)
      );

      const favorite_list = localStorage.getItem('favorite_list');
      setFavoriteContacts(favorite_list ? JSON.parse(favorite_list) : []);
    } else if (data && !loading) {
      console.log('Fetching from GQL...');
      setRegularContacts(data.contact);
      localStorage.setItem('contact_list', JSON.stringify(data.contact));
    }
  }, [data, loading]);

  return (
    <ContactsContext.Provider
      value={{
        regularContacts,
        favoriteContacts,
        loading,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsProvider;
