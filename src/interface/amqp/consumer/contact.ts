import { Channel } from "amqplib";
import R from "ramda";
import { Logger } from "@util/logger";
import { parseMessage } from "../middlewares/parse";
import { validator } from "../middlewares/validator";
import { InternalServer, InvalidProperties } from "@util/error";
import { AmqpChannel, AmqpConsumerConfig, AmqpMessage, AmqpMessageHandler, AmqpParsedMessage, IAmqpConsumer } from "@type/interface";
import { createContactSchema } from "@amqp/consumer/schemas/contact";
import { Contact } from "@type/contact";
import { CacheNamespace, SubscribeNameSpace } from "@type/system";
import pubsub from "@graphql/helpers/pubsub";

export class ContactConsumer implements IAmqpConsumer {
  private contactUseCase: AmqpConsumerConfig["coreContainer"]["contactUseCase"];
  private systemUseCase: AmqpConsumerConfig["coreContainer"]["systemUseCase"];
  private _onConsume: AmqpConsumerConfig["_onConsume"];
  private consumers = {
    create: "example-operations.create",
  };

  constructor({ coreContainer, _onConsume }: AmqpConsumerConfig) {
    this.contactUseCase = coreContainer.contactUseCase;
    this.systemUseCase = coreContainer.systemUseCase;
    this._onConsume = _onConsume;
  }

  // eslint-disable-next-line class-methods-use-this
  private finisher(
    channel: AmqpChannel,
    message: AmqpMessage,
    err?: unknown,
  ): void {
    if (err) {
      Logger.error({ err, message });
    }
    channel.ack(message);
  }

  public assertQueue(channel: Channel): void {
    channel.consume(
      this.consumers.create,
      this._onConsume(
        channel,
        this.finisher.bind(this),
        parseMessage<{
          name: string;
          phone: string;
        }>(R.__),
        validator(createContactSchema),
        this.createContact.bind(this) as AmqpMessageHandler,
      ),
    );
  }

  public async createContact(
    msg: AmqpParsedMessage<Contact>,
  ): Promise<void> {
    const contact = msg?.content;

    try {
      await this.contactUseCase.create(contact);
      this.systemUseCase.redis()?.deleteByPrefix(CacheNamespace.Contact);
      Logger.info({
        msg: "Notify contact create with success",
        obj: { contact },
      });
    } catch (err) {
      Logger.info({
        msg: "Failed to Notify contact",
        obj: { contact },
      });

      if (err instanceof InvalidProperties) {
        throw err;
      }

      const defaultMessage = "Failed to notify contact create";
      const errMessage = R.propOr(
        "Unexpected error to notify contact create",
        "message",
        err,
      ) as string;

      pubsub.publish(SubscribeNameSpace.POST_CONTACT_NOT_CREATED, {
        contactNotCreated: {
          reason: errMessage,
          data: contact
        },
      });

      throw new InternalServer(defaultMessage, [{
        msg: errMessage,
        obj: contact,
      }]);
    }
  }
}
