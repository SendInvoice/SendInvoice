import { Repository } from 'typeorm';

import { Entity } from '../';
import { Address } from '../entities';

export type CreateAddressDto = {
  StreetAddress1: string;
  StreetAddress2: string;
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

  public async find(): Promise<Entity.Address[]> {
    const addresses = this.addressRepository.find();
    return addresses;
  }

  public async createAddress(dto: CreateAddressDto): Promise<Entity.Address> {
    const address = new Address();

    address.StreetAddress1 = dto.StreetAddress1;
    address.StreetAddress2 = dto.StreetAddress2;
    address.city = dto.city;
    address.cityArea = dto.cityArea;
    address.postalCode = dto.postalCode;
    address.country = dto.country;

    const result = await this.addressRepository.save(address);

    return result;
  }

  public async findById(id: string): Promise<Address[] | null> {
    const address = await this.addressRepository.findBy({
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
    const result = await this.addressRepository.delete({ id });
    return result.affected !== 0;
  }
}
