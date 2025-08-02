import { HttpService } from "../HttpService";

export class InvoiceService extends HttpService {
    constructor(baseUrl: URL) {
        super(baseUrl);
    }

    public async createInvoice(): Promise<Invoice> {

    }
}
