import { RESTDataSource } from '@apollo/datasource-rest';
export class UserAPI extends RESTDataSource {
    constructor() {
        super(...arguments);
        this.baseURL = 'http://localhost:3002/api/v1/'; // REST API base URL
    }
    async getAllUsers(args, token) {
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
    async getUserById(args, token) {
        if (!token) {
            throw new Error('Admin token is required for this operation');
        }
        const response = await this.get(`users/${args.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
    async userDetails(_, token) {
        if (!token) {
            throw new Error('User token is required for this operation');
        }
        const response = await this.get('users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
    async adminDetails(_, token) {
        if (!token) {
            throw new Error('User token is required for this operation');
        }
        const response = await this.get('admins/me', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
    async registerUser(args) {
        const response = await this.post('users', {
            body: args.input,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
    async deleteUser(_, token) {
        if (!token) {
            throw new Error('User token is required for this operation');
        }
        const response = await this.delete('users/me', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
    async activateUser(args, token) {
        if (!token) {
            throw new Error('Admin token is required for this operation');
        }
        const response = await this.patch(`users/${args.id}/restore`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        return response;
    }
    async updateUser(args, token) {
        if (!token) {
            throw new Error('User token is required for this operation');
        }
        const response = await this.patch('users/me', {
            body: args.input,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response;
    }
    async authLogin({ username, password }) {
        try {
            const response = await this.post('login', {
                body: { username, password },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response;
        }
        catch (error) {
            // If authentication fails, throw a specific error with a custom message
            throw new Error('Invalid username or password');
        }
    }
}
