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
    },
  };