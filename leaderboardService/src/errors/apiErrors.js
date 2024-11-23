class ApiError {
    constructor({ statusCode = null, message = null, errorCode = null, shouldThrow = false  }) {
        this.statusCode = statusCode;
        this.message = message;
        this.errorCode = errorCode;
        this.shouldThrow = shouldThrow;
    }

    static badRequest({ message = null, errorCode = null, shouldThrow = false }) {
        const error = new ApiError({ statusCode: 400, message, errorCode });
        if (shouldThrow) {
            throw error;
        }
        return error;
    }

    static unauthorized({ message = null, errorCode = null, shouldThrow = false }) {
        const error = new ApiError({ statusCode: 401, message, errorCode });
        if (shouldThrow) {
            throw error;
        }
        return error;
    }

    static forbidden({ message = null, errorCode = null, shouldThrow = false }) {
        const error = new ApiError({ statusCode: 403, message, errorCode });
        if (shouldThrow) {
            throw error;
        }
        return error;
    }

    static notFound({ message = null, errorCode = null, shouldThrow = false }) {
        const error = new ApiError({ statusCode: 404, message, errorCode });
        if (shouldThrow) {
            throw error;
        }
        return error;
    }

    static internal({ message = null, errorCode = null, shouldThrow = true }) {
        const error = new ApiError({ statusCode: 500, message, errorCode });
        if (shouldThrow) {
            throw error;
        }
        return error;
    }
    
}

export { ApiError };
