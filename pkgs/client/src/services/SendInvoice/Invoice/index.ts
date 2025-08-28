import { RecipientClient } from "./RecipientClient";

export type Invoice = {
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

export type UpdateInvoicePayload = Partial<CreateInvoicePayload>;

export type CreateInvoiceItemPayload = {
    amount: number;
    description: string;
    quantity: number;
    unitPrice: number;
};

export type InvoiceItem = {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
    invoiceId: string;
};

export type UpdateInvoiceItemPayload = Partial<CreateInvoiceItemPayload>;

export class InvoiceClient {
    readonly recipient: RecipientClient;

    private baseUrl: URL;

    constructor(baseUrl: URL) {
        this.baseUrl = baseUrl;
        this.recipient = new RecipientClient(baseUrl);
    }

    async getInvoices(): Promise<Invoice[]> {
        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        });

        if (response.ok) {
            const json = await response.json();
            return json as Invoice[];
        }

        throw new Error(`Failed to fetch invoices: ${response.status} ${response.statusText}`);
    }

    async getInvoiceById(id: string): Promise<Invoice | null> {
        if (!id?.trim()) {
            throw new Error('Invoice ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        });

        if (response.status === 404) {
            return null;
        }

        if (response.ok) {
            const json = await response.json();
            return json as Invoice;
        }

        throw new Error(`Failed to fetch invoice: ${response.status} ${response.statusText}`);
    }

    async createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice`;

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

        throw new Error(`Failed to create invoice: ${response.status} ${response.statusText}`);
    }

    async updateInvoice(id: string, payload: UpdateInvoicePayload): Promise<Invoice> {
        if (!id?.trim()) {
            throw new Error('Invoice ID is required');
        }

        if (Object.keys(payload).length === 0) {
            throw new Error('At least one field must be provided for update');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/${id}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const json = await response.json();
            return json as Invoice;
        }

        if (response.status === 404) {
            throw new Error('Invoice not found');
        }

        throw new Error(`Failed to update invoice: ${response.status} ${response.statusText}`);
    }

    async deleteInvoice(id: string): Promise<void> {
        if (!id?.trim()) {
            throw new Error('Invoice ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/${id}`;

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
            throw new Error('Invoice not found');
        }

        throw new Error(`Failed to delete invoice: ${response.status} ${response.statusText}`);
    }

    //InvoiceItem Client ----------------------------------------------------------------------------------------------------------------------------

    async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
        if (!invoiceId?.trim()) {
            throw new Error('Invoice ID is required')
        }
        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/${invoiceId}/item`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        });

        if (response.status === 404) {
            throw new Error('Invoice not found');
        }

        if (response.ok) {
            const json = await response.json();
            return json as InvoiceItem[];
        }

        throw new Error(`Failed to fetch invoice items: ${response.status} ${response.statusText}`);
    }

    async getInvoiceItemById(invoiceId: string, itemId: string): Promise<InvoiceItem | null> {
        if (!invoiceId?.trim()) {
            throw new Error('Invoice ID is required')
        }

        if (!itemId?.trim()) {
            throw new Error('Item ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/${invoiceId}/item/${itemId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        });

        if (response.status === 404) {
            throw new Error('Invoice not found');
        }

        if (response.ok) {
            const json = await response.json();
            return json as InvoiceItem | null;
        }

        throw new Error(`Failed to fetch invoice item: ${response.status} ${response.statusText}`);
    }

    async createInvoiceItem(invoiceId: string, payload: CreateInvoiceItemPayload): Promise<InvoiceItem> {
        if (!invoiceId?.trim()) {
            throw new Error('Invoice ID is required')
        }

        if (!payload.amount == null || payload.quantity <= 0) {
            throw new Error('Amount is required and cannot be empty');
        }

        if (!payload.description?.trim()) {
            throw new Error('Description is required and cannot be empty');
        }

        if (payload.quantity == null || payload.quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        if (payload.unitPrice == null || payload.unitPrice < 0) {
            throw new Error('Unit price cannot be negative');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/${invoiceId}/item`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            throw new Error('Invoice not found');
        }

        if (response.ok) {
            const json = await response.json();
            return json as InvoiceItem;
        }

        throw new Error(`Failed to create invoice item: ${response.status} ${response.statusText}`);
    }

    async updateInvoiceItemById(invoiceId: string, itemId: string, payload: UpdateInvoiceItemPayload): Promise<InvoiceItem> {
        if (!invoiceId?.trim()) {
            throw new Error('Invoice ID is required');
        }

        if (!itemId?.trim()) {
            throw new Error('Item ID is required');
        }

        if (Object.keys(payload).length === 0) {
            throw new Error('At least one field must be provided for update');
        }

        if (payload.quantity !== undefined && payload.quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        if (payload.unitPrice !== undefined && payload.unitPrice < 0) {
            throw new Error('Unit price cannot be negative');
        }

        if (payload.description !== undefined && !payload.description.trim()) {
            throw new Error('Description cannot be empty');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/${invoiceId}/item/${itemId}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (response.status === 404) {
            throw new Error('Invoice item not found');
        }

        if (response.ok) {
            const json = await response.json();
            return json as InvoiceItem;
        }

        throw new Error(`Failed to update invoice item: ${response.status} ${response.statusText}`);
    }

    async deleteInvoiceItem(invoiceId: string, itemId: string): Promise<void> {
        if (!invoiceId?.trim()) {
            throw new Error('Invoice ID is required');
        }

        if (!itemId?.trim()) {
            throw new Error('Item ID is required');
        }

        const url = new URL(this.baseUrl);
        url.pathname = `/api/v1/invoice/${invoiceId}/item/${itemId}`;

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
            throw new Error('Invoice item not found');
        }

        throw new Error(`Failed to delete invoice item: ${response.status} ${response.statusText}`);
    }
}