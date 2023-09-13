'use client';

import './globals.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import styled from '@emotion/styled';

import config from '@/config';
import { colors } from '@/shared/colors';

const poppins = Poppins({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Phonebook Project',
  description: 'GOTO Phonebook project',
};

const client = new ApolloClient({
  uri: config.GRAPHQL_URL,
  cache: new InMemoryCache(),
});

const HeadingText = styled.p({
  fontWeight: 'bold',
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  margin: 0,
  color: colors.primary_green,
});

const Container = styled.div({
  padding: 16,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ApolloProvider client={client}>
          <HeadingText>Phonebook</HeadingText>
          <Container>{children}</Container>
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
