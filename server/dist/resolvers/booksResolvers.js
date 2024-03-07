import { RESTDataSource } from '@apollo/datasource-rest';
export class BookAPI extends RESTDataSource {
    constructor() {
        super(...arguments);
        this.baseURL = 'http://localhost:3002/api/v1/'; // REST API base URL
    }
    async getBooks(args) {
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
    async getBooksByCategory(args) {
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
    async getBookById(args) {
        const response = await this.get(`books/${args.id}`);
        return response;
    }
    async addBook(args, token) {
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
    async deleteBook(args, token) {
        if (!token) {
            throw new Error('Admin token is required for this operation');
        }
        const response = await this.delete(`books/${args.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
    async restoreBook(args, token) {
        if (!token) {
            throw new Error('Admin token is required for this operation');
        }
        const response = await this.patch(`books/${args.id}/restore`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
}
