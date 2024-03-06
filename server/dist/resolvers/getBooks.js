import { RESTDataSource } from '@apollo/datasource-rest';
export class BookAPI extends RESTDataSource {
    constructor() {
        super(...arguments);
        this.baseURL = 'http://localhost:3002/api/v1/'; // REST API base URL
    }
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
    async addBook({ title, description, lendingPrice, quantity, author, category, imageSrc }, token) {
        // Ensure that the token is provided
        if (!token) {
            throw new Error('Admin token is required for this operation');
        }
        const response = await this.post('books', {
            body: {
                title,
                description,
                lendingPrice,
                quantity,
                author,
                category,
                imageSrc
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        return response.data;
    }
}
