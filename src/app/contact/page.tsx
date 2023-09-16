/** @jsxImportSource @emotion/react */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import { colors } from '@/shared/colors';
import Image from 'next/image';
import { css } from '@emotion/react';
import { FaPhone, FaPlusCircle } from 'react-icons/fa';
import { isNameValid, isValidPhoneNumber } from '@/utils/validator';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_CONTACT_DETAIL_QUERY,
  MUTATE_ADD_CONTACT,
  MUTATE_EDIT_CONTACT_BY_ID,
} from '@/services/contacts';

const ContactHeader = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  height: 150,
  width: '100%',
  backgroundColor: colors.primary_green,
});

const avatarCss = css({
  transform: 'translateY(75px)',
});

const ContactForm = styled.div({
  marginTop: 75,
  padding: 16,
});

const UserId = styled.p({
  width: '100%',
  marginBottom: 4,
  fontWeight: 'bold',
  textAlign: 'center',
});

const Label = styled.label({
  fontSize: 12,
  color: 'grey',
  transition: 'all 0.3 ease',
});

const InputText = styled.input({
  padding: 8,
  margin: '6px 0',
  width: '100%',
  border: 'none',
  borderBottom: `1px solid lightgrey`,
  outline: 'none',
  backgroundColor: 'white',
  transition: 'all 0.3s ease',
  ':focus': {
    borderBottom: `1.5px solid ${colors.primary_green}`,
  },
  '::placeholder': {
    color: 'lightgray',
    opacity: '1',
  },
});

const PhoneContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: 'orange',
});

const AddPhone = styled.div({
  curson: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 8,
  marginTop: 16,
  color: colors.secondary_blue,
  border: `1px solid ${colors.secondary_blue}`,
  borderRadius: 8,
});

const ActionContainer = styled.div({
  marginTop: 16,
  display: 'flex',
  gap: 16,
});

const ActionButton = styled.button({
  padding: 16,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.primary_green,
  color: 'white',
  fontWeight: 'bold',
  width: '50%',
  border: 'none',
  outline: 'none',
  borderRadius: 6,
  fontSize: 16,
});

const ContactPage: React.FC = () => {
  const searchParams = useSearchParams();
  const user_id = searchParams.get('user_id');
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phones, setPhones] = useState(['']);

  const { data, loading, error } = useQuery(GET_CONTACT_DETAIL_QUERY, {
    variables: { id: user_id },
  });

  // Edit contact mutation
  const [editContactMutation, editContactData] = useMutation(
    MUTATE_EDIT_CONTACT_BY_ID
  );
  if (editContactData.loading) console.log('Submitting'); // TODO: Implement loading
  if (editContactData.error) console.error(editContactData.error);
  if (editContactData.data) {
    toast.success('Successfully update contact!', {
      position: 'top-right',
    });
    editContactData.data = null;
  }

  // Add contact mutation
  const [addContactMutation, addContactData] = useMutation(MUTATE_ADD_CONTACT);
  if (addContactData.loading) console.log('Adding'); // TODO: Implement loading
  if (addContactData.error) console.error(addContactData.error);
  if (addContactData.data && !user_id) {
    toast.success('Successfully add contact!', {
      position: 'top-right',
    });
    const newContactId = addContactData.data.insert_contact.returning[0].id;
    addContactData.data = null;
    setTimeout(() => {
      router.push(`/contact?user_id=${newContactId}`);
    }, 1000);
  }

  const handlePhoneInput = (idx: number, value: string) => {
    const newNumbers = phones;
    newNumbers[idx] = value;
    setPhones([...newNumbers]);
  };

  const handleSave = async () => {
    if (firstName.length === 0 || lastName.length === 0) {
      toast.error('Name field(s) cannot be empty!', {
        position: 'top-right',
      });
      return;
    }

    if (phones.every((number) => number === '')) {
      toast.error('Please fill at least 1 phone number', {
        position: 'top-right',
      });
      return;
    }

    const validFirstName = isNameValid(firstName);
    const validLastName = isNameValid(lastName);
    if (!validFirstName || !validLastName) {
      toast.error('Names cannot contain special characters!', {
        position: 'top-right',
      });
      return;
    }

    let validPhones = true;
    phones
      .filter((num) => num !== '')
      .forEach((num) => {
        if (!isValidPhoneNumber(num)) validPhones = false;
      });
    if (!validPhones) {
      toast.error('Please enter valid phone number(s)', {
        position: 'top-right',
      });
      return;
    }

    // Hit graphql query
    const payload = {
      first_name: firstName,
      last_name: lastName,
      phone_num: phones.filter((number) => number !== ''),
    };

    // If user id exists, edit id
    if (user_id) {
      // TODO: Check if name is not unique

      editContactMutation({
        variables: {
          id: user_id,
          _set: {
            first_name: payload.first_name,
            last_name: payload.last_name,
          },
        },
      });
    }
    // Add new contact alias no user id param
    else {
      addContactMutation({
        variables: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          phones: phones
            .filter((num) => num != '')
            .map((num) => ({ number: num })),
        },
      });
    }
  };

  useEffect(() => {
    if (data && data.contact_by_pk) {
      setFirstName(data.contact_by_pk.first_name);
      setLastName(data.contact_by_pk.last_name);
      setPhones([
        ...data.contact_by_pk.phones.map(
          (numObj: { number: string }) => numObj.number
        ),
      ]);
    }
  }, [data]);

  return (
    <>
      <ContactHeader>
        <Image
          css={avatarCss}
          src={'/img/avatar-2.png'}
          alt="Avatar 2"
          height={150}
          width={150}
        />
      </ContactHeader>
      <ContactForm>
        {data && data.contact_by_pk && (
          <UserId>User ID: {data.contact_by_pk.id}</UserId>
        )}
        <Label>First Name</Label>
        <InputText
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Label>Last Name</Label>
        <InputText
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <Label>Phone Number(s)</Label>
        {phones.map((phone, idx) => (
          <PhoneContainer key={idx}>
            <FaPhone />
            <InputText
              placeholder="Phone Number"
              value={phones[idx]}
              onChange={(e) => handlePhoneInput(idx, e.target.value)}
            />
          </PhoneContainer>
        ))}
        <AddPhone onClick={() => setPhones([...phones, ''])}>
          <FaPlusCircle />
        </AddPhone>
        <ActionContainer>
          <ActionButton
            css={{
              color: colors.primary_green,
              border: `1px solid ${colors.primary_green}`,
              backgroundColor: 'white',
            }}
            onClick={() => router.push('/')}
          >
            Cancel
          </ActionButton>
          <ActionButton onClick={() => handleSave()}>
            {user_id ? 'Save' : 'Add'}
          </ActionButton>
        </ActionContainer>
      </ContactForm>
    </>
  );
};

export default ContactPage;
