import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/books.js';
import { resolvers, BookAPI } from './resolvers/getBooks.js';

interface ContextValue {
  dataSources: {
    bookAPI: BookAPI;
  };
}

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});


const { url } = await startStandaloneServer(server, {
  context: async () => {
    const { cache } = server;
   return {
     // We create new instances of our data sources with each request,
     // passing in our server's cache.
     dataSources: {
       bookAPI: new BookAPI(),
     },
   };
 },
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);