import { ApiError, IApiError } from "./apiErrors.js";

class HandlerError extends ApiError {
    constructor({ statusCode = null, message = null, errorCode = null, shouldThrow = false }: Partial<IApiError>) {
        super({ statusCode, message, errorCode, shouldThrow });
    }

    private static createHandlerError({ statusCode, message, errorCode, shouldThrow = true }: Partial<IApiError>): ApiError {
        const error = new HandlerError({ statusCode, message, errorCode, shouldThrow });
        if (shouldThrow) {
            throw error;
        }
        return error;
    }

    static contentType(): ApiError {
        return this.createHandlerError({
            statusCode: 401,
            message: `[contentType] Content-Type`,
            errorCode: 'CONTENT_TYPE',
        });
    }

    static unauthorizedAccess(): ApiError {
        return this.createHandlerError({
            statusCode: 401,
            message: `[unauthorizedAccess] Unauthorized access`,
            errorCode: 'UNAUTHORIZED',
        });
    }

    static serverError(): ApiError {
        return this.createHandlerError({
            statusCode: 500,
            message: `[serverError] An internal server error occurred`,
            errorCode: 'SERVER_ERROR',
        });
    }

    static forbidden(): ApiError {
        return this.createHandlerError({
            statusCode: 403,
            message: `[forbidden] You do not have permission to perform this action`,
            errorCode: 'FORBIDDEN',
        });
    }

    static default(err: Error): ApiError {
        return this.createHandlerError({
            statusCode: 403,
            message: `[default] ${err.message}`,
            errorCode: 'DEFAULT',
        });
    }

    static handledError(err: Error) {
        const errorHandlerTypes: Record<string, () => ApiError> = {
            'Content-Type': this.contentType,
            'Invalid input': this.invalidInput,
        };

        for (const [key, handler] of Object.entries(errorHandlerTypes)) {
            if (err.message.includes(key)) {
                handler();
                return;
            }
        }

        this.default(err);
    }

    static invalidInput(): ApiError {
        return this.createHandlerError({
            statusCode: 400,
            message: `[invalidInput] The input provided is invalid.`,
            errorCode: 'INVALID_INPUT',
        });
    }
}

export { HandlerError };
