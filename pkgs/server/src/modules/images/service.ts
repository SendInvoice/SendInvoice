import { randomUUID } from 'node:crypto';
import { promises as fsPromises } from 'node:fs';
import { imageSize } from 'image-size';
import { Repository } from 'typeorm';

import { Image, MimeType } from './entity';

const SUPPORTED_MIME_TYPES = [
  MimeType.Jpg,
  MimeType.Png,
];

export class ImageService {
  private imageRepository: Repository<Image>;

  constructor(imageRepository: Repository<Image>) {
    this.imageRepository = imageRepository;
  }

  public extensionForFile(mimeType: MimeType): string | null {
    switch (mimeType) {
      case MimeType.Jpg:
        return 'jpg';
      case MimeType.Png:
        return 'png';
      default:
        return null;
    }
  }

  /**
  *
  * @param image - Image
  * @returns - String Path to Image in Hard Drive
  */
  makeImagePath(image: Image): string {
    return `./uploads/${image.id}.${this.extensionForFile(image.mimeType)}`;
  }

  async findImage(id: string): Promise<Image | null> {
    const image = await this.imageRepository.findOneById(id);

    if (!image) {
      return null;
    }

    return image;
  }

  async createImage(bytes: Buffer, {
    mimeType,
  }: {
    mimeType: MimeType;
  }): Promise<string> {
    if (!SUPPORTED_MIME_TYPES.includes(mimeType)) {
      throw new Error('Unsupported MIME type');
    }

    // https://bun.sh/guides/binary/buffer-to-typedarray
    const ims = imageSize(bytes as unknown as Uint8Array);

    if (!ims.height || !ims.width) {
      throw new Error('Invalid image. Could not determine dimensions.');
    }

    const uuidv4 = randomUUID();

    await fsPromises.writeFile(`./uploads/${uuidv4}.${this.extensionForFile(mimeType)}`, bytes);

    const image = new Image();

    image.id = uuidv4;
    image.height = ims.height;
    image.width = ims.width;
    image.size = bytes.length;
    image.mimeType = mimeType;

    const inserted = await this.imageRepository.insert(image);
    return inserted.identifiers[0].id;
  }
}
