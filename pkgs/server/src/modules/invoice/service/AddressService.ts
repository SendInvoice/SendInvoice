import { Repository } from 'typeorm';

import { Entity } from '../';
import { Address } from '../entities';

export type CreateAddressDto = {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  cityArea: string;
  postalCode: string;
  country: string;
};

export class AddressService {
  private addressRepository: Repository<Entity.Address>;

  constructor(AddressRepository: Repository<Entity.Address>) {
    this.addressRepository = AddressRepository;
  }

  public async find(query: { companyId: string; }): Promise<Entity.Address[]> {
    const addresses = this.addressRepository.find({
      where: {
        companies: {
          id: query.companyId
        }
      }
    });

    return addresses;
  }

  public async createAddress(dto: CreateAddressDto): Promise<Entity.Address> {
    const address = new Address();

    address.streetAddress1 = dto.streetAddress1;
    address.streetAddress2 = dto.streetAddress2;
    address.city = dto.city;
    address.cityArea = dto.cityArea;
    address.postalCode = dto.postalCode;
    address.country = dto.country;

    const result = await this.addressRepository.save(address);

    return result;
  }

  public async findById(id: string): Promise<Address | null> {
    const address = await this.addressRepository.findOneBy({
      id
    });

    if (!address) {
      return null;
    } else {
      return address;
    }
  }

  public async updateById(id: string, data: Partial<Address>): Promise<Address | null> {
    await this.addressRepository.update({ id }, data);
    const updated = await this.addressRepository.findOneBy({ id });
    return updated || null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.addressRepository.softDelete({ id });
    return result.affected !== 0;
  }
}
