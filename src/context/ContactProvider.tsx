import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContactProviderProps {
  children: React.ReactNode;
}

interface IContactContext {
  favoriteContacts: number[];
  addToFavorites: (contactId: number) => void;
  removeFromFavorites: (contactId: number) => void;
}

const ContactsContext = createContext<IContactContext>({} as IContactContext);

export const useContacts = () => {
  return useContext<IContactContext>(ContactsContext);
};

const ContactsProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [favoriteContacts, setFavoriteContacts] = useState<number[]>([]);

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
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsProvider;
