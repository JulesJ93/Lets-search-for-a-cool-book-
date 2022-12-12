import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        title
        bookId
        image
        description
        authors
      }
    }
  }
`;