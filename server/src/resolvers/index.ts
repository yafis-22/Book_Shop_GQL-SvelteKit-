export const resolvers = {
    Query: {
      getBooks: (_, args, { dataSources }) => dataSources.bookAPI.getBooks(args),
      getBooksByCategory: (_, args, { dataSources }) => dataSources.bookAPI.getBooksByCategory(args),
      getBookById: (_, args, { dataSources }) => dataSources.bookAPI.getBookById(args),
    },
    Mutation: {
      addBook: (_, { input }, { dataSources, token }) => {
        return dataSources.bookAPI.addBook(input, token)
      },
      deleteBook: (_, args, { dataSources, token }) => dataSources.bookAPI.deleteBook(args, token),
      restoreBook: (_, args, { dataSources, token }) => {
        return dataSources.bookAPI.restoreBook(args, token)
      },
    },
  };