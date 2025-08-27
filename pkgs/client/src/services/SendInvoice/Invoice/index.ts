import { RecipientClient } from "./RecipientClient";

export type Invoice = {
    id: string;
};

export type CreateInvoicePayload = {
    id: string;
    invoiceNumber: string;
    subtotal: number;
    tax: number;
    total: number;
    date: Date;
    dueDate: Date;
    notes: string;
    billToAddressId: string;
    shipToAddressId: string;
    userId: string;
    companyId: string;
    recipientCompanyId: string;
    items: CreateInvoiceItemPayload[];
};

export type CreateInvoiceItemPayload = {
    amount: number;
    description: string;
    quantity: number;
    unitPrice: number;
};
export class InvoiceClient {
    readonly recipient: RecipientClient;

    private baseUrl: URL;

    constructor(baseUrl: URL) {
        this.baseUrl = baseUrl;
        this.recipient = new RecipientClient(baseUrl);
    }

    async createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
        const url = new URL(this.baseUrl);

        url.pathname = '/api/v1/invoice';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const json = await response.json();
            return json as Invoice;
        }

        throw Error(`Server responded with ${response.status}`)
    }
}
