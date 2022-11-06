import { Pagination } from "./interface"

export interface Contact {
  id: number
  name: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export interface IContactRepository {
  find(filter: Partial<Contact>, pagination: Pagination): Promise<Array<Contact>>;
  asyncCreate(contact: Contact): Promise<void>;
  create(contact: Contact): Promise<void>;
  update(contact: Contact): Promise<void>;
  delete(contact: Contact): Promise<void>;
}

export interface IContactService {
  find(filter: Partial<Contact>, pagination: Pagination): Promise<Array<Contact>>;
  asyncCreate(contact: Contact): Promise<void>;
  create(contact: Contact): Promise<void>;
  update(contact: Contact): Promise<void>;
  delete(contact: Contact): Promise<void>;
}

export interface IContactUseCase {
  find(filter: Partial<Contact>, pagination: Pagination): Promise<Array<Contact>>;
  asyncCreate(contact: Contact): Promise<void>;
  create(contact: Contact): Promise<void>;
  update(id: number, contact: Contact): Promise<void>;
  delete(id: number): Promise<void>;
}
