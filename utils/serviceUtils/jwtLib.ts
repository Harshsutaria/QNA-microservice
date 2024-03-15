import jwt from "jsonwebtoken";

const JWT_SIGN_SECRET: string = "jZ8nPqGKv6UHrL2Ae7Yx3";

/**
 * Create JWT token based on the json payload.
 * @param payload
 * @returns string
 */
export function createJWTToken(payload: object): string {
  const token = jwt.sign(payload, JWT_SIGN_SECRET, {
    algorithm: "HS256",
    expiresIn: "30d",
  });

  return token;
}

/**
 * Validates JWT token.
 * @param token
 * @returns
 */
export function verifyJWT(token: string) {
  try {
    const tokenData = jwt.verify(token, JWT_SIGN_SECRET);
    return tokenData;
  } catch (error: any) {
    if (error.name == jwt.TokenExpiredError.name) {
      return { errorMessage: "TOKEN EXPIRED" };
    } else if (error.message == "invalid signature") {
      return { errorMessage: "INVALID TOKEN" };
    } else if (error.message == "invalid token") {
      return { errorMessage: "INVALID TOKEN" };
    } else if (error.name == SyntaxError.name) {
      return { errorMessage: "INVALID TOKEN" };
    }
    throw error;
  }
}
