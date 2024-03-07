export const resolvers = {
    Query: {
      // Query for Books
      getBooks: (_, args, { dataSources }) => dataSources.bookAPI.getBooks(args),
      getBooksByCategory: (_, args, { dataSources }) => dataSources.bookAPI.getBooksByCategory(args),
      getBookById: (_, args, { dataSources }) => dataSources.bookAPI.getBookById(args),

      //Query for Users
      getAllUsers: (_, args, { dataSources, token }) => {
        return dataSources.userAPI.getAllUsers(args, token)
      },
      getUserById: (_, args, { dataSources, token }) => {
        return dataSources.userAPI.getUserById(args, token)
      }
    },
    Mutation: {
      // For Books
      addBook: (_, { input }, { dataSources, token }) => {
        return dataSources.bookAPI.addBook(input, token)
      },
      deleteBook: (_, args, { dataSources, token }) => {
        return dataSources.bookAPI.deleteBook(args, token)
      },
      restoreBook: (_, args, { dataSources, token }) => {
        return dataSources.bookAPI.restoreBook(args, token)
      },
      updateBook: (_, args, { dataSources, token }) => {
        return dataSources.bookAPI.updateBook(args, token)
      },

      //For Users
      registerUser: (_, args, { dataSources }) => {
        return dataSources.userAPI.registerUser(args)
      },
      deleteUser: (_, args, { dataSources, token }) => {
        return dataSources.userAPI.deleteUser(args, token)
      },
      activateUser: (_, args, { dataSources, token }) => {
        return dataSources.userAPI.activateUser(args, token)
      },
      updateUser: (_, args, { dataSources, token }) => {
        return dataSources.userAPI.updateUser(args, token)
      },
    },
  };