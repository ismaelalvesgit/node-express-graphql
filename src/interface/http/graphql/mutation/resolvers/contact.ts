import { GraphqlResolver } from "@type/interface";
import catchAsync from "interface/http/graphql/helpers/catchAsync";

const contactMutation: GraphqlResolver =  {
    asyncCreateContact: catchAsync(async(root, args, context)=> {
        const { data } = args;
        await context.coreContainer.contactUseCase.asyncCreate(data);
        return context.i18n("Contact.asyncCreate", {});
    }),

    createContact: catchAsync(async(root, args, context)=> {
        const { data } = args;
        await context.coreContainer.contactUseCase.create(data);
        return context.i18n("Contact.create", {});
    }),

    updateContact: catchAsync(async(root, args, context)=> {
        const { data, id } = args;
        await context.coreContainer.contactUseCase.update(id, data);
        return context.i18n("Contact.update", {});
    }),

    deleteContact: catchAsync(async(root, args, context)=> {
        const { id } = args;
        await context.coreContainer.contactUseCase.delete(id);
        return context.i18n("Contact.delete", {});
    })
};

export default contactMutation;