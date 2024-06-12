import { Tag } from './tag.model';

export class Book {
  id?: string;
  title: string;
  date: Date;
  author: string;
  tags: Tag[];
  imageUrl?: string;
  userId: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.date = data.date;
    this.author = data.author;
    this.tags = data.tags;
    this.imageUrl = data.imageUrl || '';
    this.userId = data.userId;
  }
  // Method to convert a Book instance into a plain object
  toFirestore() {
    return {
      title: this.title,
      author: this.author,
      imageUrl: this.imageUrl,
      tags: this.tags,
      date: this.date,
    };
  }

  validate(): boolean {
    if (
      !this.title ||
      !this.date ||
      !this.author ||
      this.tags.length === 0 ||
      !this.userId
    ) {
      return false;
    }
    return true;
  }
}
