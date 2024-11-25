export interface IApiError {
    statusCode: number | null;
    message: string | null;
    errorCode: string | null;
    shouldThrow: boolean;
}

class ApiError {
    private statusCode: number | null;
    public message: string | null;
    public errorCode: string | null;
    public shouldThrow: boolean;

    constructor({ statusCode = null, message = null, errorCode = null, shouldThrow = false }: Partial<IApiError>) {
        this.statusCode = statusCode;
        this.message = message;
        this.errorCode = errorCode;
        this.shouldThrow = shouldThrow;
    }

    private static createError({ statusCode, message, errorCode, shouldThrow }: Partial<IApiError>): ApiError {
        const error = new ApiError({ statusCode, message, errorCode, shouldThrow });
        if (shouldThrow) {
            throw error;
        }
        return error;
    }

    static badRequest({ message = null, errorCode = null, shouldThrow = false }: Partial<IApiError>) {
        return this.createError({ statusCode: 400, message, errorCode, shouldThrow });
    }

    static unauthorized({ message = null, errorCode = null, shouldThrow = false }: Partial<IApiError>) {
        return this.createError({ statusCode: 401, message, errorCode, shouldThrow });
    }

    static forbidden({ message = null, errorCode = null, shouldThrow = false }: Partial<IApiError>) {
        return this.createError({ statusCode: 403, message, errorCode, shouldThrow });
    }

    static notFound({ message = null, errorCode = null, shouldThrow = false }: Partial<IApiError>) {
        return this.createError({ statusCode: 404, message, errorCode, shouldThrow });
    }

    static internal({ message = null, errorCode = null, shouldThrow = true }: Partial<IApiError>) {
        return this.createError({ statusCode: 500, message, errorCode, shouldThrow });
    }
}

export { ApiError };
