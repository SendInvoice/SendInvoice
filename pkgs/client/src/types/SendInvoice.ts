export namespace SendInv oice {
    export type Invoice = {
        id: string;
        invoiceNumber: string;
        subtotal: number;
        tax: number;
        total: number;
        date: Date;
        dueDate: Date;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
        billToAddress: Address;
        shipToAddress: Address;
        user: User;
        items: InvoiceItem[];
        company: Company;
        recipientCompany: Recipient;
    };

    export type User = {
        id: string;
        name: string;
        surname: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        companies: Company[];
        invoices: Invoice;
        tokens: Token[];
    }

    export type Recipient = {
        id: string;
        recipientName: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        address: Address;
        invoices: Invoice[];
    }

    export type Company = {
        id: string;
        name: string;
        phone: string;
        logo: string;
        signature: string;
        createdAt: Date;
        updatedAt: Date;
        user: User;
        address: Address;
        invoices: Invoice[];
    }

    export type Address = {
        id: string;
        StreetAddress1: string;
        StreetAddress2: string;
        city: string;
        cityArea: string;
        postalCode: string;
        country: string;
        createdAt: Date;
        updatedAt: Date;
        companies: Company[];
        recipients: Recipient[];
        billedInvoices: Invoice[];
        shippedInvoices: Invoice[];
    }

    export type InvoiceItem = {
        id: string;
        amount: number;
        description: string;
        quantity: number;
        unitPrice: number;
        createdAt: Date;
        updatedAt: Date;
        invoice: Invoice;
    }

    export type Token = {
        id: string;
        token: string;
        createdAt: Date;
        updatedAt: Date;
        user: User;
    }
}