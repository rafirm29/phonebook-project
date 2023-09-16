import { IContact } from '@/shared/interface';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContactProviderProps {
  children: React.ReactNode;
}

interface IContactContext {
  favoriteContacts: number[];
  addToFavorites: (contactId: number) => void;
  removeFromFavorites: (contactId: number) => void;
  setAllContacts: React.Dispatch<React.SetStateAction<IContact[]>>;
  isNameAlreadyExist: (
    first_name: string,
    last_name: string,
    id?: number
  ) => boolean;
}

const ContactsContext = createContext<IContactContext>({} as IContactContext);

export const useContacts = () => {
  return useContext<IContactContext>(ContactsContext);
};

const ContactsProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [favoriteContacts, setFavoriteContacts] = useState<number[]>([]);
  const [allContacts, setAllContacts] = useState<IContact[]>([]);

  const addToFavorites = (contactId: number) => {
    const updatedFavoriteContacts = [...favoriteContacts, contactId];
    setFavoriteContacts(updatedFavoriteContacts);

    localStorage.setItem(
      'favorite_list',
      JSON.stringify(updatedFavoriteContacts)
    );
  };

  const removeFromFavorites = (contactId: number) => {
    const updatedFavoriteContacts = favoriteContacts.filter(
      (cid) => cid !== contactId
    );
    setFavoriteContacts(updatedFavoriteContacts);

    localStorage.setItem(
      'favorite_list',
      JSON.stringify(updatedFavoriteContacts)
    );
  };

  const isNameAlreadyExist = (
    first_name: string,
    last_name: string,
    id?: number
  ): boolean => {
    if (id) {
      return allContacts.some((contact) => {
        return (
          contact.id !== id &&
          contact.first_name === first_name &&
          contact.last_name === last_name
        );
      });
    } else {
      return allContacts.some((contact) => {
        return (
          contact.first_name === first_name && contact.last_name === last_name
        );
      });
    }
  };

  useEffect(() => {
    const favorite_list = localStorage.getItem('favorite_list');
    if (favorite_list) setFavoriteContacts(JSON.parse(favorite_list));
  }, []);

  return (
    <ContactsContext.Provider
      value={{
        favoriteContacts,
        addToFavorites,
        removeFromFavorites,
        setAllContacts,
        isNameAlreadyExist,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsProvider;
