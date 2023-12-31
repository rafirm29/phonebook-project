'use client';

import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import styled from '@emotion/styled';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import config from '@/config';
import { colors } from '@/shared/colors';
import ContactsProvider from '@/context/ContactProvider';

const poppins = Poppins({ weight: '400', subsets: ['latin'] });

const client = new ApolloClient({
  uri: config.GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const Heading = styled.div({
  display: 'flex',
  width: '100vw',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  borderBottom: '1px solid lightgrey',
  backgroundColor: 'white',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
});

const HeadingText = styled.p({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: colors.primary_green,
});

const Container = styled.div({
  marginTop: 70,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Phonebook App Project</title>
        <meta name="description" content="Mini Phonebook Project"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </head>
      <body className={poppins.className}>
        <ApolloProvider client={client}>
          <ContactsProvider>
            <Heading>
              <HeadingText>Phonebook</HeadingText>
            </Heading>
            <Container>{children}</Container>
            <ToastContainer />
          </ContactsProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}

if (process.env.NODE_ENV !== 'production') {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
