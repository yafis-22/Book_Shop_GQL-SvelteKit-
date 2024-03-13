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
    createdAt: String!
    updatedAt: String!
    deletedAt: String
  }

  type UserBook {
    id: ID!
    title: String!
    author: String!
    category: String!
    initialCharge: Float!
    additionalCharge: Float!
    totalCharge: Float!
    days: Float!
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

  type UserResponse {
    message: String!
    user: User
  }

  type CommonUserResponse {
    message: String!
    data: User
  }

  type LoginResponse {
    message: String!
    userToken: String
    adminToken: String
    role: String!
  }

  type Query {
    getAllUsers(search: String, page: Int, pageSize: Int, sortField: String, sortOrder: String): UserList!
    getUserById(id: ID!): User
    userDetails: CommonUserResponse!
  }

  type Mutation {
    registerUser(input: AddUserInput!): UserResponse
    deleteUser: CommonUserResponse!
    activateUser(id: ID!): CommonUserResponse!
    updateUser(id: ID!, input: UpdateUserInput!): UserResponse!
    authLogin(username: String!, password: String!): LoginResponse
  }

  input AddUserInput {
    username: String!
    password: String!
    email: String!
    phoneNumber: String!
    address: String!
    role: UserRole
  }

  input UpdateUserInput {
    password: String
    email: String
    phoneNumber: String
    address: String
  }
`;
