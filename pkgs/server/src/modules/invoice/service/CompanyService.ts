import { Repository } from 'typeorm';

import { Entity } from '../';
import { Company } from '../entities';
import type { ImageService } from '../../image';

export type CreateCompanyDto = {
  name: string;
  phone: string;
  logoId: string;
  signatureId: string;
  userId: string;
  addressId: string;
};

export class CompanyService {
  private companyRepository: Repository<Entity.Company>;
  private imageService: ImageService;

  constructor(CompanyRepository: Repository<Entity.Company>, imageService: ImageService) {
    this.companyRepository = CompanyRepository;
    this.imageService = imageService;
  }

  public async find(): Promise<Entity.Company[]> {
    const companies = this.companyRepository.find({
      relations: ['user', 'address', 'invoices']
    });
    return companies;
  }

  public async findById(id: string): Promise<Company | null> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['user', 'address', 'invoices']
    });

    return company || null;
  }

  public async createCompany(dto: CreateCompanyDto): Promise<Entity.Company> {
    const company = new Company();

    const logo = await this.imageService.findById(dto.logoId);

    if (!logo) {
      throw new Error('Logo image not found');
    }

    const signature = await this.imageService.findById(dto.signatureId);

    if (!signature) {
      throw new Error('Signature image not found');
    }

    company.name = dto.name;
    company.phone = dto.phone;
    company.logo = logo;
    company.signature = signature;

    company.user = { id: dto.userId } as any;
    company.address = { id: dto.addressId } as any;

    const result = await this.companyRepository.save(company);

    return result;
  }

  public async updateById(id: string, data: Partial<Company>): Promise<Company | null> {
    await this.companyRepository.update({ id }, data);
    const updated = await this.companyRepository.findOneBy({ id });
    return updated || null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await this.companyRepository.softDelete({ id });
    return result.affected !== 0;
  }
}
