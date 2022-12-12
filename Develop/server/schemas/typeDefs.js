const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    me(username: String, id: ID): User
  }
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    bookId: String
    authors: [String]!
    description: String
    title: String
    image: String
    link: String
  }
  