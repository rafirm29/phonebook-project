import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter, useSearchParams } from 'next/navigation'; // Replace with your router import
import ContactPage from '@/app/contact/page'; // Replace with your component import
import { GET_CONTACT_DETAIL_QUERY } from '@/services/contacts'; // Replace with your GraphQL query imports
import ContactsProvider from '@/context/ContactProvider'; // Replace with your context import

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: () => new URLSearchParams({ user_id: '1' }),
  useRouter: jest.fn(),
}));

const mocks = [
  {
    request: {
      query: GET_CONTACT_DETAIL_QUERY,
      variables: {
        id: 1,
      },
    },
    result: {
      data: {
        contact_by_pk: {
          last_name: 'Doe',
          id: 1,
          first_name: 'John',
          created_at: '2023-09-16T12:29:14.444911+00:00',
          phones: [
            {
              number: '62812345678',
            },
          ],
        },
      },
    },
  },
];

describe('ContactPage', () => {
  it('renders ContactPage with initial data', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ContactsProvider>
          <ContactPage />
        </ContactsProvider>
      </MockedProvider>
    );

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Phone Number(s)')).toBeInTheDocument();
  });
});
