export const typeDefs = `#graphql

type User {
    id: ID!
    username: String!
    password: String!
    email: String!
    phoneNumber: String!
    address: String!
    role: UserRole!
    lentBooks: [UserBook]
  }

  type UserBook {
    id: ID!
    title: String!
    author: String!
    category: String!
    LentBooks: [LentBook]
  }

  type LentBook {
    initialCharge: Float
    timestamp: String
  }

  enum UserRole {
    user
    admin
  }

  type UserList {
    message: String!
    totalUsers: Int!
    usersFetched: Int!
    data: [User]!
    currentPage: Int!
    totalPages: Int!
  }

  type Query {
    getAllUsers(search: String, page: Int, pageSize: Int, sortField: String, sortOrder: String): UserList!
    getUserById(id: ID!): User
  }
`;