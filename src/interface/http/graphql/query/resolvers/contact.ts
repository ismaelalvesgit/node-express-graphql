import { Pagination, GraphqlResolver } from "@type/interface";
import { CacheNamespace } from "@type/system";
import { cacheQuery } from "../../helpers/cache";

const contactQuery: GraphqlResolver =  {
    allContact: cacheQuery(async(parent, args, { coreContainer } )=>{
        const { pagination, filter } = args;
   
        return coreContainer.contactUseCase.find(filter, {
            ...pagination
        } as Pagination);
    }, { path: CacheNamespace.Contact })
};

export default contactQuery;