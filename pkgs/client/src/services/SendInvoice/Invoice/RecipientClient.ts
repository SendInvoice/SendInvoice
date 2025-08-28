export type Recipient = {
    id: string;
    recipientName: string;
    phone: string;
    addressId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateRecipientPayload = {
    recipientName: string;
    phone: string;
    addressId: string;
};

export type UpdateRecipientPayload = Partial<{
    recipientName: string;
    phone: string;
    addressId: string;
}>;
export class RecipientClient {
    private baseUrl: URL;

    constructor(baseUrl: URL) {
        this.baseUrl = baseUrl;
    }

    async getRecipients(): Promise<Recipient[]> {
        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/recipient`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const json = await response.json();
            return json as Recipient[];
        }

        throw new Error(`Failed to fetch recipients: ${response.status} ${response.statusText}`);
    }

    async getRecipientById(id: string): Promise<Recipient | null> {
        if (!id?.trim()) {
            throw new Error('Recipient ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/recipient/${id}`;

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
            return json as Recipient;
        }

        throw new Error(`Failed to fetch recipient: ${response.status} ${response.statusText}`);
    }

    async createRecipient(payload: CreateRecipientPayload): Promise<Recipient> {

        if (!payload.recipientName?.trim()) {
            throw new Error('Recipient name is required');
        }
        if (!payload.phone?.trim()) {
            throw new Error('Phone is required');
        }
        if (!payload.addressId?.trim()) {
            throw new Error('Address ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/recipients`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const json = await response.json();
            return json as Recipient;
        }

        throw new Error(`Failed to create recipient: ${response.status} ${response.statusText}`);
    }

    async updateRecipient(id: string, payload: UpdateRecipientPayload): Promise<Recipient> {
        if (!id?.trim()) {
            throw new Error('Recipient ID is required');
        }

        if (Object.keys(payload).length === 0) {
            throw new Error('At least one field must be provided for update');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/recipient/${id}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const json = await response.json();
            return json as Recipient;
        }

        if (response.status === 404) {
            throw new Error('Recipient not found');
        }

        throw new Error(`Failed to update recipient: ${response.status} ${response.statusText}`);
    }

    async deleteRecipient(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new Error('Recipient ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/recipient/${id}`;

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
            throw new Error('Recipient not found');
        }

        throw new Error(`Failed to delete recipient: ${response.status} ${response.statusText}`);
    }
}
