/** @jsxImportSource @emotion/react */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import { colors } from '@/shared/colors';
import Image from 'next/image';
import { css } from '@emotion/react';
import { FaInfo, FaInfoCircle, FaPhone, FaPlusCircle } from 'react-icons/fa';
import { isNameValid, isValidPhoneNumber } from '@/utils/validator';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_CONTACT_DETAIL_QUERY,
  MUTATE_ADD_CONTACT,
  MUTATE_ADD_NUMBER_TO_CONTACT,
  MUTATE_EDIT_CONTACT_BY_ID,
  MUTATE_EDIT_PHONE_NUMBER,
} from '@/services/contacts';
import { useContacts } from '@/context/ContactProvider';

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
  display: 'flex',
  alignItems: 'center',
  gap: 8,
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
  cursor: 'pointer',
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
  cursor: 'pointer',
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

const Modal = styled.div({
  position: 'fixed',
  width: 250,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 20,
  backgroundColor: 'white',
  padding: 16,
  borderRadius: 8,
  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
  touchAction: 'none',
});

const ModalBtn = styled.button({
  cursor: 'pointer',
  padding: 16,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  color: colors.secondary_blue,
  fontWeight: 'bold',
  width: '100%',
  border: `1px solid ${colors.secondary_blue}`,
  outline: 'none',
  borderRadius: 6,
  fontSize: 16,
});

const ContactPage: React.FC = () => {
  const searchParams = useSearchParams();
  const user_id = searchParams.get('user_id');
  const router = useRouter();
  const { isNameAlreadyExist } = useContacts();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phones, setPhones] = useState(['']);
  const [developerNotesOpen, setDeveloperNotesOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data, loading, error } = useQuery(GET_CONTACT_DETAIL_QUERY, {
    variables: { id: user_id },
  });

  // Edit contact mutation
  const [editContactMutation, editContactData] = useMutation(
    MUTATE_EDIT_CONTACT_BY_ID
  );
  if (editContactData.loading) console.log('Submitting'); // TODO: Implement loading
  if (editContactData.error) console.error(editContactData.error);

  // Edit number mutation
  const [editNumberMutation, editNumberData] = useMutation(
    MUTATE_EDIT_PHONE_NUMBER
  );
  const [addNumberMutation, addNumberData] = useMutation(
    MUTATE_ADD_NUMBER_TO_CONTACT
  );
  if (editNumberData.loading) console.log('Submitting number'); // TODO: Implement loading
  if (editNumberData.data && editContactData.data && submitted) {
    toast.success('Successfully update contact!', {
      position: 'top-right',
    });
    editNumberData.data = null;
    editContactData.data = null;
    setSubmitted(false);
  }
  if (addNumberData.data) {
    addNumberData.data = null;
  }

  // Add contact mutation
  const [addContactMutation, addContactData] = useMutation(MUTATE_ADD_CONTACT);
  if (addContactData.loading) console.log('Adding'); // TODO: Implement loading
  if (addContactData.error) {
    console.error(addContactData.error.message);
    if (addContactData.error.message.includes('phone_number_key')) {
      toast.error('Phone number already exists! Please enter another number', {
        position: 'top-right',
      });
    } else {
      toast.error('Something went wrong. Please try again later.', {
        position: 'top-right',
      });
    }
  }
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

    const duplicateName = isNameAlreadyExist(
      firstName,
      lastName,
      user_id ? parseInt(user_id) : undefined
    );
    if (duplicateName) {
      toast.error(
        `Name "${firstName} ${lastName}" already exist! Please choose other unique name`,
        {
          position: 'top-right',
        }
      );
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
      editContactMutation({
        variables: {
          id: user_id,
          _set: {
            first_name: payload.first_name,
            last_name: payload.last_name,
          },
        },
      });

      // Edit number and add new ones
      const existingPhones: Array<{ number: string }> =
        data.contact_by_pk.phones;
      const existingPhonesMaxIdx = existingPhones.length - 1;
      phones.forEach((newNumber, idx) => {
        if (newNumber !== '') {
          // While edit
          if (idx <= existingPhonesMaxIdx) {
            console.log(existingPhones[idx].number);
            console.log(newNumber);
            editNumberMutation({
              variables: {
                pk_columns: {
                  number: existingPhones[idx].number,
                  contact_id: user_id,
                },
                new_phone_number: newNumber,
              },
            });
          } else {
            // New numbers
            addNumberMutation({
              variables: {
                contact_id: user_id,
                phone_number: newNumber,
              },
            });
          }
        }
      });

      setSubmitted(true);
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
        {/* Adds another input text without changing others */}
        <InputText
          placeholder="New Input"
          onChange={(e) => console.log(e.target.value)}
        />
        <Label>
          Phone Number(s){' '}
          <FaInfoCircle
            css={{ cursor: 'pointer', color: colors.secondary_blue }}
            onClick={() => setDeveloperNotesOpen(true)}
          />
        </Label>
        {phones.map((_, idx) => (
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
            Back
          </ActionButton>
          <ActionButton onClick={() => handleSave()}>
            {user_id ? 'Save' : 'Add'}
          </ActionButton>
        </ActionContainer>
      </ContactForm>
      {developerNotesOpen && (
        <Modal>
          <p css={{ textAlign: 'justify', fontSize: 12 }}>
            This is a note from developer. The phone numbers GQL mutation (edit
            and delete) may cause inconsistency on phone numbers order, thus it
            may feels like the numbers are shuffling after saving/update
            contact. Developer has verified it through various experiment on the
            GQL playground, so please do understand this user experience
            behaviour 🙏
          </p>
          <div css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ModalBtn onClick={() => setDeveloperNotesOpen(false)}>
              Cancel
            </ModalBtn>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ContactPage;
