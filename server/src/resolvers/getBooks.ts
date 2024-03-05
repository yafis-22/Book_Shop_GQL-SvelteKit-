import { RESTDataSource } from '@apollo/datasource-rest';

export class BookAPI extends RESTDataSource {
  baseURL = 'http://localhost:3002/api/v1/'; // REST API base URL

  async getBooks({ search, searchFields, page, pageSize, sortField, sortOrder }) {
    const response = await this.get('books', {
      params: {
        search,
        searchFields: searchFields?.join(','),
        page: page?.toString(),
        pageSize: pageSize?.toString(),
        sortField,
        sortOrder,
      }
    });
    return response; 
  }

  async getBooksByCategory({ category, page, pageSize, sortField, sortOrder }) {
    const response = await this.get(`books/category/${category}`, {
      params: {
        page: page?.toString(),
        pageSize: pageSize?.toString(),
        sortField,
        sortOrder,
      }
    });
    return response; 
  }

  async getBookById({ id }) {
    const response = await this.get(`books/${id}`);
    return response;
  }
}

export const resolvers = {
  Query: {
    getBooks: (_, args, { dataSources }) => dataSources.bookAPI.getBooks(args),
    getBooksByCategory: (_, args, { dataSources }) => dataSources.bookAPI.getBooksByCategory(args),
    getBookById: (_, args, { dataSources }) => dataSources.bookAPI.getBookById(args),
  },
};