export const successResponse = <T>(data: T, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message: string, statusCode = 500) => ({
  success: false,
  message,
  statusCode,
});
