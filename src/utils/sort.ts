import { IContact } from '@/shared/interface';

export const sortContacts = (contacts: IContact[]) => {
  return contacts
    .slice()
    .sort((a, b) => a.first_name.localeCompare(b.first_name));
};
