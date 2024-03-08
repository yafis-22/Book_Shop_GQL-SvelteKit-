import { RESTDataSource } from '@apollo/datasource-rest';

interface GetBooksArgs {
  search?: string;
  searchFields?: string[];
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
}

interface AddBookArgs {
  title: string;
  description: string;
  lendingPrice: number;
  quantity: number;
  author: string;
  category: string;
  imageSrc: string;
}

export class BookAPI extends RESTDataSource {
  baseURL = 'http://localhost:3002/api/v1/'; // REST API base URL

  async getBooks(args: GetBooksArgs) {
    const response = await this.get('books', {
      params: {
        search: args.search,
        searchFields: args.searchFields?.join(','),
        page: args.page?.toString(),
        pageSize: args.pageSize?.toString(),
        sortField: args.sortField,
        sortOrder: args.sortOrder,
      },
    });
    return response; 
  }

  async getBooksByCategory(args: GetBooksArgs & { category: string }) {
    const response = await this.get(`books/category/${args.category}`, {
      params: {
        page: args.page?.toString(),
        pageSize: args.pageSize?.toString(),
        sortField: args.sortField,
        sortOrder: args.sortOrder,
      },
    });
    return response; 
  }

  async getBookById(args: { id: string }) {
    const response = await this.get(`books/${args.id}`);
    return response;
  }

  async addBook(args: AddBookArgs, token: string) {
    // Ensure that the token is provided
    if (!token) {
      throw new Error('Admin token is required for this operation');
    }

    const response = await this.post('books', {
      body: {
        title: args.title,
        description: args.description,
        lendingPrice: args.lendingPrice,
        quantity: args.quantity,
        author: args.author,
        category: args.category,
        imageSrc: args.imageSrc,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  }

  async deleteBook(args: { id: string }, token: string) {
    if (!token) {
      throw new Error('Admin token is required for this operation');
    }
    const response = await this.delete(`books/${args.id}`, {
      headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }}
    );
    return response;
  }

  async restoreBook(args: { id: string }, token: string) {
    if (!token) {
      throw new Error('Admin token is required for this operation');
    }
    const response = await this.patch(`books/${args.id}/restore`, {
      headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }}
    );
    return response;
  }

  async updateBook(args: { id: string; input: any }, token: string) {
    if (!token) {
      throw new Error('Admin token is required for this operation');
    }
    const response = await this.put(`books/${args.id}`,  {
      body:args.input,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response;
  }

  async lendBook(args: { id: string }, token: string) {
    if (!token) {
      throw new Error('User token is required for this operation');
    }
    const response = await this.post(`books/lend/${args.id}`, {
      headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }}
    );
    return response;
  }

  async returnBook(args: { id: string }, token: string) {
    if (!token) {
      throw new Error('User token is required for this operation');
    }
    const response = await this.post(`books/return/${args.id}`, {
      headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }}
    );
    return response;
  }
  
}