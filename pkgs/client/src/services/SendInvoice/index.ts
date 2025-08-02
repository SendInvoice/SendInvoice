import { InvoiceService } from "./Invoice";

export class SendInvoiceService {
    public readonly invoice: InvoiceService;

    constructor(baseUrl: URL) {
        this.invoice = new InvoiceService(baseUrl);
    }
}
