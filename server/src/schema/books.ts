export const typeDefs = `#graphql

  type Book {
    id: ID!
    title: String!
    description: String!
    lendingPrice: Float!
    quantity: Int!
    author: String!
    category: String!
    imageSrc: String
    createdAt: String!
    updatedAt: String!
    deletedAt: String
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

  type CommonBookResponse {
    message: String!
    data: Book
  }

  type ChargeDetails {
    data: Book!
    initialCharge: Float!
  }
  
  type LendBookResponse {
    message: String!
    chargeDetails: ChargeDetails
  }

  type BookReturnDetails {
    bookId: ID!
    initialCharge: Float!
    additionalCharge: Float!
    totalCharge: Float!
    days: Int!
  }
  
  type ReturnBookResponse {
    message: String!
    data: BookReturnDetails
  }

  type Mutation {
    addBook(input: AddBookInput!): Book
    deleteBook(id: ID!): DeleteBookResponse!
    restoreBook(id: ID!): CommonBookResponse!
    updateBook(id: ID!, input: AddBookInput!): CommonBookResponse!
    lendBook(id: ID!): LendBookResponse!
    returnBook(id: ID!): ReturnBookResponse!
  }

  type Query {
    getBooks(search: String, searchFields: [String], page: Int, pageSize: Int, sortField: String, sortOrder: String): BookResponse
    getBooksByCategory(category: String, page: Int, pageSize: Int, sortField: String, sortOrder: String): BookResponse
    getBookById(id: ID!): Book
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
