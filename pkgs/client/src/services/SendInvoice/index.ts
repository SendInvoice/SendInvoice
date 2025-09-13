import { AuthClient } from "./Auth";
import { InvoiceClient } from "./Invoice";
import { AddressClient } from "./Invoice/AddressClient";
import { CompanyClient } from "./Invoice/CompanyClient";
import { RecipientClient } from "./Invoice/RecipientClient";

export class SendInvoiceClient {
    public readonly address: AddressClient;
    public readonly auth: AuthClient;
    public readonly company: CompanyClient;
    public readonly invoice: InvoiceClient;
    public readonly recipient: RecipientClient;
    
    constructor(baseUrl: URL) {
        this.address = new AddressClient(baseUrl);
        this.auth = new AuthClient(baseUrl);
        this.company = new CompanyClient(baseUrl);
        this.invoice = new InvoiceClient(baseUrl);
        this.recipient = new RecipientClient(baseUrl);
    }
}
