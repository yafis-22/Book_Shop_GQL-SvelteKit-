import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/books.js';
import { BookAPI } from './resolvers/booksResolvers.js';
import { resolvers } from './resolvers/index.js';

interface ContextValue {
  dataSources: {
    bookAPI: BookAPI;
  };
  token?: string;
}

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});


const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    // Extract and verify admin token from headers
    const token = req.headers.authorization?.replace('Bearer ', '');

    return {
      dataSources: {
        bookAPI: new BookAPI(),
      },
      token,
    };
  },
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);