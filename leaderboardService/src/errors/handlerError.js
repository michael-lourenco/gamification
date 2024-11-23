import { ApiError } from "./apiErrors.js";

class HandlerError extends ApiError {
    constructor({ statusCode = null, message = null, errorCode = null, shouldThrow = false }) {
        super({ statusCode, message, errorCode, shouldThrow });
    }

    static contentType() {
        const error = new HandlerError({ 
            statusCode: 401, 
            message: `[contentType] Content-Type`, 
            errorCode: 'CONTENT_TYPE', 
            shouldThrow: true 
        });
        throw error;
    }
    
    static unauthorizedAccess() {
        const error = new HandlerError({ 
            statusCode: 401, 
            message: `[unauthorizedAccess] Unauthorized access`, 
            errorCode: 'UNAUTHORIZED', 
            shouldThrow: true 
        });
        throw error;
    }

    static serverError() {
        const error = new HandlerError({ 
            statusCode: 500, 
            message: `[serverError] An internal server error occurred`, 
            errorCode: 'SERVER_ERROR', 
            shouldThrow: true 
        });
        throw error;
    }

    static forbidden() {
        const error = new HandlerError({ 
            statusCode: 403, 
            message: `[forbidden] You do not have permission to perform this action`, 
            errorCode: 'FORBIDDEN', 
            shouldThrow: true 
        });
        throw error;
    }
    
    static default(err) {
        const error = new HandlerError({ 
            statusCode: 403, 
            message: `[default] ${err}`, 
            errorCode: 'DEFAULT', 
            shouldThrow: true 
        });
        throw error;
    }
    

    static handledError(err) {

        const errorHandlerTypes = {
            'Content-Type': HandlerError.contentType,
            'Invalid input': HandlerError.invalidInput,
        };
        let numberOfErrors = 0;

        for (const [key, handler] of Object.entries(errorHandlerTypes)) {
            if (err.message.includes(key)) {
                numberOfErrors +=1;
                handler(); 
                break; 
            } 
        }

        if(numberOfErrors == 0){
            HandlerError.default(err);
        }
    }
    
}

export { HandlerError };
