export const typeDefs = `#graphql

  type Book {
    id: ID!
    title: String!
    description: String!
    lendingPrice: Int!
    quantity: Int!
    author: String!
    category: String!
    imageSrc: String
  }
  
  type Query {
    getBooks(search: String, searchFields: [String], page: Int, pageSize: Int, sortField: String, sortOrder: String): BookResponse
    getBooksByCategory(category: String, page: Int, pageSize: Int, sortField: String, sortOrder: String): BookResponse
    getBookById(id: ID!): Book
  }

  type BookResponse {
    message: String
    totalBooks: Int
    booksFetched: Int
    data: [Book]
    currentPage: Int
    totalPages: Int
  }

  type DeleteBookResponse {
    message: String!
    data: Int
  }

  type Mutation {
    addBook(input: AddBookInput!): Book
    deleteBook(id: ID!): DeleteBookResponse!
  }
  
  input AddBookInput {
    title: String!
    description: String!
    lendingPrice: Float!
    quantity: Int!
    author: String!
    category: String!
    imageSrc: String
  }
`;
