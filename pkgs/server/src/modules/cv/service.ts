import { In, Repository } from 'typeorm';

import { Entity } from './';

import type { User } from '../user';

export type CreateCVDto = {
    title: string;
    contact?: {
      email?: string;
    }
};

export class CVService {
  private cvRepository: Repository<Entity.CV>;
  private cvContactRepository: Repository<Entity.Contact>;

  constructor(cvRepository: Repository<Entity.CV>, cvContactRepository: Repository<Entity.Contact>) {
    this.cvRepository = cvRepository;
    this.cvContactRepository = cvContactRepository;
  }

  async create(user: User, dto: CreateCVDto): Promise<Entity.CV[]> {
    const entityCv = new Entity.CV();

    entityCv.title = dto.title;
    entityCv.user = user;

    const entityContact = new Entity.Contact();

    if (dto.contact) {
      const contactPayload = dto.contact;

      if (contactPayload.email) {
        entityContact.email = contactPayload.email;
      }
    }

    entityContact.user = user;

    await this.cvContactRepository.insert(entityContact);
    entityCv.contact = entityContact;
    const inserted = await this.cvRepository.insert(entityCv);

    return this.cvRepository.findBy({ id: In([inserted.identifiers[0].id]) });
  }
}
