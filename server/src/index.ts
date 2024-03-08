import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs as booksTypeDefs } from './schema/books.js';
import { typeDefs as usersTypeDefs } from './schema/users.js';
import { BookAPI } from './resolvers/booksResolvers.js';
import { resolvers } from './resolvers/index.js';
import { UserAPI } from './resolvers/usersResolvers.js';

interface ContextValue {
  dataSources: {
    bookAPI: BookAPI;
    userAPI: UserAPI
  };
  token?: string;
}

const server = new ApolloServer<ContextValue>({
  typeDefs: [booksTypeDefs, usersTypeDefs], 
  resolvers,
});


const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const { cache } = server;
    // Extract and verify admin token from headers
    const token = req.headers.authorization?.replace('Bearer ', '');

    return {
      dataSources: {
        bookAPI: new BookAPI({cache}),
        userAPI: new UserAPI({cache})
      },
      token,
    };
  },
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);