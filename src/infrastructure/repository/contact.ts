import {
  IMessageBusAdapter,
  IMessageBusAdapterConstructs,
  IMysqlAdapter,
} from "@type/infrastructure";
import { Contact, IContactRepository } from "@type/contact";
import { Pagination } from "@type/interface";
import R from "ramda";
import pubsub from "@graphql/helpers/pubsub";
import { SubscribeNameSpace } from "@type/system";
import { env } from "@util/env";

export type Context = {
  mysqlAdapter: IMysqlAdapter;
  messageBusAdapter: IMessageBusAdapterConstructs;
};

export class ContactRepository implements IContactRepository {
  private mysqlAdapter: Context["mysqlAdapter"];
  private messageBusAdapter: IMessageBusAdapter;

  constructor({ mysqlAdapter, messageBusAdapter }: Context) {
    this.mysqlAdapter = mysqlAdapter;
    this.mysqlAdapter.tableName = "contact";
    this.messageBusAdapter = new messageBusAdapter();
  }

  public async find(filter: Partial<Contact>, pagination: Pagination): Promise<Contact[]> {
    const { page, size, sort, sortBy } = pagination;
    return this.mysqlAdapter.db
      .where(R.reject(R.isNil, {...filter}))
      .offset(page || 0)
      .limit(size || 100)
      .orderBy(sortBy || "name", sort || "asc");
  }

  async asyncCreate(contact: Contact): Promise<void> {
    await this.messageBusAdapter.publish(
      env.get().amqp.exchanges.example.key,
      env.get().amqp.exchanges.example.routing,
      contact
    );
  }

  public async create(contact: Contact): Promise<void> {
    await this.mysqlAdapter.db.insert(contact);
    pubsub.publish(SubscribeNameSpace.POST_CONTACT_CREATED, {
      contactCreated: contact,
    });
  }

  public async update(contact: Contact): Promise<void> {
    await this.mysqlAdapter.db
    .where({id: contact.id})
    .update(contact);
  }

  public async delete(contact: Contact): Promise<void> {
    await this.mysqlAdapter.db
    .where({id: contact.id})
    .del();
  }

}
