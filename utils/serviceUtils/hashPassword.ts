import crypto from "crypto";
import logger from "./loggerUtil";

/**
 * Method implemented to create password hash.
 * @param plainPassword
 * @returns
 */
export function createHashPassword(plainPassword: string) {
  const hash = crypto.createHash("sha256");
  hash.update(plainPassword);
  return hash.digest("hex");
}

/**
 * Method implemented to verify user password using hash algorithm
 * @param plainPassword
 * @param hashPassWordHash
 * @returns
 */
export function verifyPassword(
  plainPassword: string,
  hashPassWordHash: any
): boolean {
  const plainPasswordHash = createHashPassword(plainPassword);
  logger.info(`${plainPasswordHash === hashPassWordHash}`);
  return plainPasswordHash === hashPassWordHash;
}
