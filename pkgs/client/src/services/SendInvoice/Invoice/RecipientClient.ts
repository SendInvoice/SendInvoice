export type Recipient = {
    id: string;
};

export type CreateRecipientPayload = {
  recipientName: string;
  phone: string;
  addressId: string;
}

export class RecipientClient {
    private baseUrl: URL;

    constructor(baseUrl: URL) {
        this.baseUrl = baseUrl;
    }

    async createRecipient(payload: CreateRecipientPayload): Promise<Recipient> {
        const url = new URL(this.baseUrl);

        url.pathname = '/api/v1/invoice/recipients';

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

        throw Error(`Server responded with ${response.status}`)
    }
}
