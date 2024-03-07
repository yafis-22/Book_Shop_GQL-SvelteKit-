import { RESTDataSource } from '@apollo/datasource-rest';

interface GetUsersArgs {
  search?: string;
  searchFields?: string[];
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
}

export class UserAPI extends RESTDataSource {
    baseURL = 'http://localhost:3002/api/v1/'; // REST API base URL
  
    async getAllUsers(args: GetUsersArgs, token: string) {
        if (!token) {
            throw new Error('Admin token is required for this operation');
          }
      const response = await this.get('users', {
        params: {
          search: args.search,
          searchFields: args.searchFields?.join(','),
          page: args.page?.toString(),
          pageSize: args.pageSize?.toString(),
          sortField: args.sortField,
          sortOrder: args.sortOrder,
        },
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
      });
      return response; 
    }
  
    async getUserById(args: { id: string }, token: string) {
        if (!token) {
            throw new Error('Admin token is required for this operation');
          }
      const response = await this.get(`users/${args.id}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }}
      );
      return response;
    }
}