import { GraphqlHandler, IContext } from "@type/interface";
import { CustomError, FailedSQL, InvalidProperties, NotFound } from "@util/error";
import { Logger } from "@util/logger";
import { ValidationErrorItem } from "joi";
import R from "ramda";
import { GraphQLError } from "graphql";
import { getAgent } from "@util/apm";

const errorsConfigs = [
    { class: NotFound, type: null, value: "NotFoundError" },
    { class: FailedSQL, type: "ER_DUP_ENTRY", value: "BadRequest.Duplicate" },
    { class: FailedSQL, type: "ERROR", value: "InternalServer" },
    { class: InvalidProperties, type: "any.required", value: "InvalidProperties.required" },
    { class: InvalidProperties, type: "any.only", value: "InvalidProperties.only" },
    { class: InvalidProperties, type: "string.base", value: "InvalidProperties.base" },
    { class: InvalidProperties, type: "string.empty", value: "InvalidProperties.empty" },
    { class: InvalidProperties, type: "string.min", value: "InvalidProperties.min" },
    { class: InvalidProperties, type: "string.email", value: "InvalidProperties.email" },
    { class: InvalidProperties, type: "async.exist", value: "InvalidProperties.async" },
];

const _getErrorConfig = error => errorsConfigs.find((errorConfig) => {
    if (error instanceof NotFound && error instanceof errorConfig.class) {
      return errorConfig;
    }
    if (error instanceof errorConfig.class && error.i18n === errorConfig.type) {
      return errorConfig;
    }
    return false;
});

const _isSqlError = (ctx: IContext, err: any)=>{
    if(err.sqlMessage){
        const i18n = err.code;
        const message = `Invalid request ${ctx.requestId}`;
        const details = [{message: err.sqlMessage}];
        return new FailedSQL(message, details, i18n);
    }
    return err;
};

const _loadErrorMessage = (ctx: IContext, err: CustomError): GraphQLError =>{
    const { i18n, requestId } = ctx;
    err = _isSqlError(ctx, err);
    
    switch (err.constructor) {
        case InvalidProperties: {
            const details = err.extensions.details as Array<ValidationErrorItem>;
            details.map((detail)=>{
                err.i18n = detail.type;
                const errorConfig = _getErrorConfig(err);
                if(errorConfig){
                    detail.message = i18n(errorConfig.value, R.reject(R.isNil, {
                        name: detail.context?.key,
                        limit: detail.context?.limit,
                        value: detail.context?.value,
                        valids: detail.context?.valids,
                        code: detail.type
                    }));
                }
            });
            break;
        }
        case FailedSQL: {
            const details = err.extensions.details as Array<{message: string}>;
            details.map((detail)=>{
                if(detail.message.includes("unique")){
                    const errorConfig = _getErrorConfig(err);
                    if(errorConfig){
                        const name = detail.message.split(/'(.*?)'/)[1];
                        detail.message = i18n(errorConfig.value, R.reject(R.isNil, {
                            name,
                            requestId
                        }));
                    }
                }
            });
            break;
        }
        default: {
            if (getAgent() && getAgent().isStarted()) {
                getAgent().captureError(err);
            }
        }
    }

    throw new GraphQLError(err.message, {
        extensions: {
            ...err.extensions,
            requestId
        }
    });
};

const catchAsync = (fn: GraphqlHandler) => async (root: any, args: any, ctx: IContext) => {
    try {
        return await Promise.resolve(fn(root, args, ctx));
    } catch (err: any) {
        Logger.warn(`requestId: ${ctx.requestId}, error: ${err}`);
        throw _loadErrorMessage(ctx, err);
    }
};

export default catchAsync;