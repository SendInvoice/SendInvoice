import { Repository } from 'typeorm';

import { Entity } from '../';
import { Company } from '../entities';

export type CreateCompanyDto = {
  name: string;
  phone: string;
  logo: string;
  signature: string;
  userId: string;
  addressId: string;
};

export class CompanyService {
  private companyRepository: Repository<Entity.Company>;

  constructor(CompanyRepository: Repository<Entity.Company>) {
    this.companyRepository = CompanyRepository;
  }

  public async find(): Promise<Entity.Company[]> {
    const companies = this.companyRepository.find({
      relations: ['user', 'address', 'invoices']
    });
    return companies;
  }

  public async createCompany(dto: CreateCompanyDto): Promise<Entity.Company> {
    const company = new Company();

    company.name = dto.name;
    company.phone = dto.phone;
    company.logo = dto.logo;
    company.signature = dto.signature;

    company.user = { id: dto.userId } as any;
    company.address = { id: dto.addressId } as any;

    const result = await this.companyRepository.save(company);

    return result;
  }

  public async findById(id: string): Promise<Company | null> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user', 'address', 'invoices']
    });

    return company || null;
  }

  public async updateById(id: string, data: Partial<Company>): Promise<Company | null> {
    await this.companyRepository.update({ id }, data);
    const updated = await this.companyRepository.findOneBy({ id });
    return updated || null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.companyRepository.delete({ id });
    return result.affected !== 0;
  }
}
