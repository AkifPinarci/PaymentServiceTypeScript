/**
 * Custom error factory for application errors
 * This provides a functional approach to create custom errors with status codes
 */

type AppErrorType = Error & {
	statusCode: number;
};

/**
 * Creates a custom error with status code
 * @param message Error message
 * @param statusCode HTTP status code
 * @returns Enhanced error object with statusCode
 */
const createAppError = (message: string, statusCode: number): AppErrorType => {
	const error = new Error(message) as AppErrorType;
	error.statusCode = statusCode;
	error.name = "AppError";
	Error.captureStackTrace(error, createAppError);
	return error;
};

// Define common error factory methods
const AppError = {
	badRequest: (message?: string) => createAppError(message || "Bad Request", 400),
	unauthorized: (message?: string) => createAppError(message || "Unauthorized", 401),
	forbidden: (message?: string) => createAppError(message || "Forbidden", 403),
	notFound: (message?: string) => createAppError(message || "Not Found", 404),
	internal: (message?: string) => createAppError(message || "Internal Server Error", 500),
	create: createAppError,
};

export default AppError;
