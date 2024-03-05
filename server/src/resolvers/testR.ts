import { books } from "../index.js"; 

export const resolvers = {
    Query: {
      books: () => books,
    },
  };