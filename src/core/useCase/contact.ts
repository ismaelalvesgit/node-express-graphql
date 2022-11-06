import { UseCaseContext } from "@type/core";
import { Contact, IContactUseCase } from "@type/contact";
import { createContactSchema, updateContactSchema } from "./schemas/contact";
import { Pagination } from "@type/interface";
import validateProperties from "@util/validation";
import { CacheNamespace } from "@type/system";

export class ContactUseCase implements IContactUseCase {
  private contactService: UseCaseContext["contactService"];
  private systemService: UseCaseContext["systemService"];

  constructor(ctx: UseCaseContext) {
    this.contactService = ctx.contactService;
    this.systemService = ctx.systemService;
  }

  public async find(filter: Partial<Contact>, pagination: Pagination): Promise<Array<any>> {
    return this.contactService.find(filter, pagination);
  }

  public async asyncCreate(contact: Contact): Promise<void> {
    validateProperties({
      params: contact,
      schema: createContactSchema,
      errorMsg: "Invalid properties to create contact",
    });

    await this.contactService.asyncCreate(contact);
  }

  public async create(contact: Contact): Promise<void> {
    validateProperties({
      params: contact,
      schema: createContactSchema,
      errorMsg: "Invalid properties to create contact",
    });

    await this.contactService.create(contact);
    this.systemService.redis()?.deleteByPrefix(CacheNamespace.Contact);
  }
  
  public async update(id: number, contact: Contact): Promise<void> {
    validateProperties({
      params: contact,
      schema: updateContactSchema,
      errorMsg: "Invalid properties to update contact",
    });
    await this.contactService.update({
      ...contact,
      id
    });
    this.systemService.redis()?.deleteByPrefix(CacheNamespace.Contact);
  }
  
  public async delete(id: number): Promise<void> {
    const contact = { id } as Contact;
    await this.contactService.delete(contact);
    this.systemService.redis()?.deleteByPrefix(CacheNamespace.Contact);
  }
}
