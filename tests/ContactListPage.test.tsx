import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ContactListPage from '@/app/page';
import { GET_CONTACT } from '@/services/contacts';
import ContactsProvider from '@/context/ContactProvider';

// Mock Apollo Client and Context Providers as needed
const mocks = [
  {
    request: {
      query: GET_CONTACT,
    },
    result: {
      data: {
        contact: [
          {
            created_at: '2023-09-16T08:05:47.308106+00:00',
            first_name: 'John',
            id: 1,
            last_name: 'Doe',
            phones: [
              {
                number: '123',
              },
            ],
          },
          {
            created_at: '2023-09-16T08:05:48.308106+00:00',
            first_name: 'Alice',
            id: 2,
            last_name: 'Wonder',
            phones: [
              {
                number: '234',
              },
            ],
          },
          {
            created_at: '2023-09-16T08:05:49.308106+00:00',
            first_name: 'Bob',
            id: 3,
            last_name: 'Builder',
            phones: [
              {
                number: '345',
              },
            ],
          },
        ],
      },
    },
  },
];

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ContactListPage', () => {
  it('renders Favorites section', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactsProvider>
          <ContactListPage />
        </ContactsProvider>
      </MockedProvider>
    );
    expect(getByText('Favorites')).toBeInTheDocument();
    expect(getByText('Contacts')).toBeInTheDocument();
  });

  it('renders all mocked contact', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactsProvider>
          <ContactListPage />
        </ContactsProvider>
      </MockedProvider>
    );

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(await screen.findByText('Alice Wonder')).toBeInTheDocument();
    expect(await screen.findByText('Bob Builder')).toBeInTheDocument();
  });

  it('updates searchQuery when the search input changes', () => {
    const { getByPlaceholderText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactsProvider>
          <ContactListPage />
        </ContactsProvider>
      </MockedProvider>
    );
    const searchInput = getByPlaceholderText('Search contact');

    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect((searchInput as HTMLInputElement).value).toBe('John');
  });
});
