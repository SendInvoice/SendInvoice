import { Repository } from 'typeorm';

import { Image, ImagePurpose } from './entity';

export type UploadImageDto = {
  bytes: Buffer;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  purpose: ImagePurpose;
}

export class ImageService {
  private imageRepository: Repository<Image>;

  constructor(tokenRepository: Repository<Image>) {
    this.imageRepository = tokenRepository;
  }

  async uploadImage(dto: UploadImageDto): Promise<Image> {
    const image = new Image();

    image.bytes = dto.bytes;
    image.mimeType = dto.mimeType;
    image.size = dto.size;
    image.width = dto.width;
    image.height = dto.height;
    image.purpose = dto.purpose;

    return this.imageRepository.save(image);
  }
}
