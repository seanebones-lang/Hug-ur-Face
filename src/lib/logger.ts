import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      }
    }
  }),
  base: {
    env: process.env.NODE_ENV,
  },
});

// Helper functions for common log patterns
export const logAuth = {
  signup: (email: string, success: boolean, ip?: string) =>
    logger.info({ email, success, ip, event: 'auth:signup' }, 'User signup attempt'),
  login: (email: string, success: boolean, ip?: string) =>
    logger.info({ email, success, ip, event: 'auth:login' }, 'User login attempt'),
  verification: (email: string, success: boolean) =>
    logger.info({ email, success, event: 'auth:verification' }, 'Email verification'),
  passwordReset: (email: string) =>
    logger.info({ email, event: 'auth:password_reset' }, 'Password reset requested'),
};

export const logGeneration = {
  start: (userId: string, prompt: string) =>
    logger.info({ userId, promptLength: prompt.length, event: 'generation:start' }, 'Image generation started'),
  success: (userId: string, durationMs: number) =>
    logger.info({ userId, durationMs, event: 'generation:success' }, 'Image generation completed'),
  error: (userId: string, error: string) =>
    logger.error({ userId, error, event: 'generation:error' }, 'Image generation failed'),
};

export const logPayment = {
  checkout: (userId: string, bundle: string, amount: number) =>
    logger.info({ userId, bundle, amount, event: 'payment:checkout' }, 'Checkout session created'),
  success: (userId: string, bundle: string, credits: number) =>
    logger.info({ userId, bundle, credits, event: 'payment:success' }, 'Payment completed'),
};
