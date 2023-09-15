import { IContact } from '@/shared/interface';
import { gql } from '@apollo/client';

export interface ContactResult {
  contact: Array<IContact>;
}

export const GET_CONTACT = gql`
  query GetContactList(
    $distinct_on: [contact_select_column!]
    $limit: Int
    $offset: Int
    $order_by: [contact_order_by!]
    $where: contact_bool_exp
  ) {
    contact(
      distinct_on: $distinct_on
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }
`;

export const get_contact_detail_query = (id: number) => {
  const query = gql`
  query GetContactDetail($id: Int!){
    contact_by_pk(id: $id) {
    last_name
    id
    first_name
    created_at
    phones {
      number
    }
  }
}
{
  "id": ${id}
}
  `;

  return query;
};
