import { Repository } from 'typeorm';

import { Title } from './entity';

export type CreateTitleDto = Omit<Title, 'id' | 'createdAt' | 'updatedAt'>;

export type TitleListItem = Title & {
  coverImageUrl: string | null;
};

export class TitleService {
  private titleRepository: Repository<Title>;

  constructor(titleRepository: Repository<Title>) {
    this.titleRepository = titleRepository;
  }

  async getTitles(): Promise<TitleListItem[]> {
    const titles = await this.titleRepository.find();

    return titles.map((title) => ({
      ...title,
      coverImageUrl: title.coverImageId
        ? `http://localhost:3000/api/v1/images/${title.coverImageId}`
        : null
    }));
  }

  async getTitleById(id: string): Promise<TitleListItem | null> {
    const title = await this.titleRepository.findOneById(id);

    if (!title) {
      return null;
    }

    return {
      ...title,
      coverImageUrl: title.coverImageId
        ? `http://localhost:3000/api/v1/images/${title.coverImageId}`
        : null
    };
  }

  async createTitle(dto: CreateTitleDto): Promise<Title[]> {
    const title = new Title();

    title.title = dto.title;
    title.starRating = dto.starRating;
    title.releaseDate = dto.releaseDate;
    title.audienceRating = dto.audienceRating;
    title.contentType = dto.contentType;
    title.coverImageId = dto.coverImageId;

    const inserted = await this.titleRepository.insert(title);

    return this.titleRepository.findByIds(inserted.identifiers);
  }

  async deleteTitle(id: string): Promise<boolean> {
    const inserted = await this.titleRepository.delete({
      id
    });

    return !!inserted.affected;
  }
}
