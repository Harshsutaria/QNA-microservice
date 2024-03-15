import ValidationResultInterface from "../../utils/interfaces/validationResultInterface";
import { verifyPassword } from "../../utils/serviceUtils/hashPassword";
import { ROLE } from "../constants/service-constants";

/**
 * Validate user payload
 * @param payload
 * @returns ValidationResultInterface
 */
export function validateUserRequestPayload(
  payload: any
): ValidationResultInterface {
  const validationResult: ValidationResultInterface = {
    status: true,
    message: `Profile validation successfully`,
  };

  if (!payload.userName) {
    validationResult.status = false;
    validationResult.message = "User name is mandatory for creating profile";
    return validationResult;
  }

  if (!payload.userEmail) {
    validationResult.status = false;
    validationResult.message = "User Email is mandatory for creating profile";
    return validationResult;
  }

  if (!payload.userRole) {
    validationResult.status = false;
    validationResult.message = "User role is mandatory for creating profile";
    return validationResult;
  }

  if (!Object.values(ROLE).includes(payload.userRole)) {
    validationResult.status = false;
    validationResult.message = "IN-VALID user role";
    return validationResult;
  }

  if (!payload.password || payload.password.length <= 8) {
    validationResult.status = false;
    validationResult.message =
      "Valid User password is mandatory for creating profile";
    return validationResult;
  }

  return validationResult;
}

/**
 * Wrapper to validate user password
 * @param plainPassword
 * @param savedPassword
 * @returns ValidationResultInterface
 */
export function validateUserPassword(
  plainPassword: string,
  savedPassword: any
): ValidationResultInterface {
  const validationResult: ValidationResultInterface = {
    status: false,
    message: `Password validation failed`,
  };

  if (verifyPassword(plainPassword, savedPassword)) {
    validationResult.status = true;
    validationResult.message = "Password validation successful";
    return validationResult;
  }

  return validationResult;
}
