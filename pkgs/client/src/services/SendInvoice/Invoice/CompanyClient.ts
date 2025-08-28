import type { Address } from './AddressClient';

export type Company = {
    id: string;
    name: string;
    phone: string;
    logo: string;
    signature: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    user?: {
        id: string;
    };
    address?: Address;
    invoices?: any[]; 
};

export type CreateCompanyPayload = {
    name: string;
    phone: string;
    logo: string;
    signature: string;
    userId: string;
    addressId: string;
};

export type UpdateCompanyPayload = Partial<Omit<CreateCompanyPayload, 'userId'>>;

export class CompanyClient {
    private baseUrl: URL;

    constructor(baseUrl: URL) {
        this.baseUrl = baseUrl;
    }

    async getCompanies(): Promise<Company[]> {
        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/company`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const json = await response.json();
            return json as Company[];
        }

        throw new Error(`Failed to fetch companies: ${response.status} ${response.statusText}`);
    }

    async getCompanyById(id: string): Promise<Company | null> {
        if (!id?.trim()) {
            throw new Error('Company ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/company/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 404) {
            return null;
        }

        if (response.ok) {
            const json = await response.json();
            return json as Company;
        }

        throw new Error(`Failed to fetch company: ${response.status} ${response.statusText}`);
    }


    async createCompany(payload: CreateCompanyPayload): Promise<Company> {
        if (!payload.name?.trim()) {
            throw new Error('Company name is required');
        }
        if (!payload.phone?.trim()) {
            throw new Error('Phone is required');
        }

        if (!payload.addressId?.trim()) {
            throw new Error('Address ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/company`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const json = await response.json();
            return json as Company;
        }

        if (response.status === 400) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Invalid company data');
        }

        throw new Error(`Failed to create company: ${response.status} ${response.statusText}`);
    }

    async updateCompany(id: string, payload: UpdateCompanyPayload): Promise<Company> {
        if (!id?.trim()) {
            throw new Error('Company ID is required');
        }

        if (Object.keys(payload).length === 0) {
            throw new Error('At least one field must be provided for update');
        }

        if (payload.name !== undefined && !payload.name.trim()) {
            throw new Error('Company name cannot be empty');
        }
        if (payload.phone !== undefined && !payload.phone.trim()) {
            throw new Error('Phone cannot be empty');
        }
        if (payload.logo !== undefined && !payload.logo.trim()) {
            throw new Error('Logo cannot be empty');
        }
        if (payload.signature !== undefined && !payload.signature.trim()) {
            throw new Error('Signature cannot be empty');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/company/${id}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const json = await response.json();
            return json as Company;
        }

        if (response.status === 404) {
            throw new Error('Company not found');
        }

        if (response.status === 400) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Invalid company data');
        }

        throw new Error(`Failed to update company: ${response.status} ${response.statusText}`);
    }

    async deleteCompany(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new Error('Company ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/company/${id}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return;
        }

        if (response.status === 404) {
            throw new Error('Company not found');
        }

        throw new Error(`Failed to delete company: ${response.status} ${response.statusText}`);
    }

}