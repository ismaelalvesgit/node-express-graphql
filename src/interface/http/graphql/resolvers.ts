import { QueryResolvers } from "./query/resolvers";
import MutationResolver from "./mutation/resolvers";
import { SubscriptionResolvers } from "./subscriptions/resolvers";
import { DateScalar, TimeScalar, DateTimeScalar } from "graphql-date-scalars";

const resolvers = {
    Query: QueryResolvers,
    Mutation: MutationResolver,
    Subscription: SubscriptionResolvers,
    Date: DateScalar,
    Time: TimeScalar,
    DateTime: DateTimeScalar,
};

export default resolvers;