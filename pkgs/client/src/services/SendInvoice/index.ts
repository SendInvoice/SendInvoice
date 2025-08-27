import { InvoiceClient } from "./Invoice";
import { RecipientClient } from "./Invoice/RecipientClient";

export class SendInvoiceClient {
    public readonly invoice: InvoiceClient;
    public readonly recipient: RecipientClient;

    constructor(baseUrl: URL) {
        this.invoice = new InvoiceClient(baseUrl);
        this.recipient = new RecipientClient(baseUrl);
    }
}
