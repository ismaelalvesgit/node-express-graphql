import { GraphqlSubscription } from "@type/interface";
import pubsub from "@graphql/helpers/pubsub";
import { SubscribeNameSpace } from "@type/system";

const contactMutation: GraphqlSubscription =  {
    contactCreated: {
        subscribe: ()=> pubsub.asyncIterator(SubscribeNameSpace.POST_CONTACT_CREATED)
    },
    contactNotCreated: {
        subscribe: ()=> pubsub.asyncIterator(SubscribeNameSpace.POST_CONTACT_NOT_CREATED)
    },
};

export default contactMutation;