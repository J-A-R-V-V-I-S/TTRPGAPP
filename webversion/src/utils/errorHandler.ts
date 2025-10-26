/**
 * Error Handler Utilities
 *
 * Standardizes error handling across all contexts.
 * Provides consistent error logging and validation.
 */

/**
 * Log error with context information
 */
export const logError = (context: string, error: any): void => {
  console.error(`❌ Erro em ${context}:`, error);
};

/**
 * Log success with context information
 */
export const logSuccess = (message: string): void => {
  console.log(`✅ ${message}`);
};

/**
 * Log warning with context information
 */
export const logWarning = (message: string): void => {
  console.log(`⚠️ ${message}`);
};

/**
 * Validate character ID exists
 * Throws error with context if validation fails
 */
export const validateCharacterId = (characterId: string | undefined | null, context: string): void => {
  if (!characterId) {
    const errorMessage = `Nenhum personagem carregado (${context})`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Handle database operation with standardized error logging
 * Returns null on error instead of throwing
 */
export const handleDbOperation = async <T>(
  operation: () => Promise<T>,
  context: string,
  defaultValue: T
): Promise<T> => {
  try {
    return await operation();
  } catch (err) {
    logError(context, err);
    return defaultValue;
  }
};

/**
 * Execute operation and log result
 */
export const executeWithLogging = async <T>(
  operation: () => Promise<T>,
  context: string,
  successMessage?: string
): Promise<T> => {
  try {
    const result = await operation();
    if (successMessage) {
      logSuccess(successMessage);
    }
    return result;
  } catch (err) {
    logError(context, err);
    throw err;
  }
};
