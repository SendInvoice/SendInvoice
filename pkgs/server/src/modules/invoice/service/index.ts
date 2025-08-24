import { AddressService } from './AddressService';
import { CompanyService } from './CompanyService';
import { RecipientService } from './RecipientService';

export class InvoiceService {
  public readonly address: AddressService;
  public readonly company: CompanyService;
  public readonly recipient: RecipientService;

  constructor(address: AddressService,
              company: CompanyService,
              recipient: RecipientService
  ) {
    this.address = address;
    this.company = company;
    this.recipient = recipient;
  }
}
