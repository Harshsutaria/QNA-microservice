/**
 * Added logger for messages and errors
 */
const logger = {
  info: (message: string) => console.log(message),
  error: (errorMessage: string) => console.error(errorMessage),
};

export default logger;
