export type Address = {
    id: string;
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    cityArea: string;
    postalCode: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateAddressPayload = {
    streetAddress1: string;
    streetAddress2: string;
    city: string;
    cityArea: string;
    postalCode: string;
    country: string;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export class AddressClient {
    private baseUrl: URL;

    constructor(baseUrl: URL) {
        this.baseUrl = baseUrl;
    }

    async getAddresses(): Promise<Address[]> {
        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/address`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        });

        if (response.ok) {
            const json = await response.json();
            return json as Address[];
        }
        
        throw new Error(`Failed to fetch addresses: ${response.status} ${response.statusText}`);
    }

    async getAddressById(id: string): Promise<Address> {
        if (!id?.trim()) {
            throw new Error('Address ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/address/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        });

        if (response.status === 404) {
            throw new Error('Address not found');
        }

        if (response.ok) {
            const json = await response.json();
            return json as Address;
        }

        throw new Error(`Failed to fetch addresses: ${response.status} ${response.statusText}`);
    }

    async createAddress(payload: CreateAddressPayload): Promise<Address> {
        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/address`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const json = await response.json();
            return json as Address;
        }

        throw new Error(`Failed to create address: ${response.status} ${response.statusText}`);
    }

    async updateAddress(id: string, payload: UpdateAddressPayload): Promise<Address> {
        if (!id?.trim()) {
            throw new Error('Address ID is required');
        }

        if (Object.keys(payload).length === 0) {
            throw new Error('At least one field must be provided for update');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/address/${id}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            throw new Error('Address not found');
        }

        if (response.ok) {
            const json = await response.json();
            return json as Address;
        }

        throw new Error(`Failed to update address: ${response.status} ${response.statusText}`);
    }

    async deleteAddress(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new Error('Address ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/address/${id}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
        });

        if (response.status === 404) {
            throw new Error('Address not found');
        }

        if (response.ok) {
            return;
        }

        throw new Error(`Failed to delete address: ${response.status} ${response.statusText}`);
    }
}