import { Pagination, ResolverParams } from "@type/interface";
import { CacheNamespace } from "@type/system";
import { cacheQuery } from "../../helpers/cache";

const contactQuery: ResolverParams =  {
    allContact: cacheQuery(async(parent, args, { coreContainer } )=>{
        const { pagination, filter } = args;
   
        return coreContainer.contactUseCase.find(filter, {
            ...pagination
        } as Pagination);
    }, { path: CacheNamespace.Contact })
};

export default contactQuery;