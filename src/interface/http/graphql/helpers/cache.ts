import { GraphqlHandler, IContext } from "@type/interface";
import hash from "object-hash";

export interface CacheHandlerParams { 
    path: string
    timeExp?: number
}

export const cacheQuery = (fn: GraphqlHandler, {path, timeExp}: CacheHandlerParams)=> async (root: any, args: any, ctx: IContext) => {
    const key = path.concat(":", hash(args));
    const data = await ctx.coreContainer.systemUseCase.redis()?.get(key);
    if(data){
        return data;
    }
    const writeCache = await Promise.resolve(fn(root, args, ctx));
    ctx.coreContainer.systemUseCase.redis()?.set(key, JSON.stringify(writeCache), timeExp || 600);
    return writeCache;
};