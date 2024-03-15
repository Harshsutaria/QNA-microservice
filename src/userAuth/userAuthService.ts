import UserInterface from "../../utils/interfaces/userInterface";
import ValidationResultInterface from "../../utils/interfaces/validationResultInterface";
import { UserDao } from "./userAuthDao";
import {
  validateUserPassword,
  validateUserRequestPayload,
} from "./userAuthValidation";
import { v4 as uuidv4 } from "uuid";
import logger from "../../utils/serviceUtils/loggerUtil";
import { createHashPassword } from "../../utils/serviceUtils/hashPassword";
import { createJWTToken } from "../../utils/serviceUtils/jwtLib";

export class UserAuthService {
  private userDao;

  constructor() {
    this.userDao = new UserDao();
  }

  /**
   * Signup service layer.
   * @param author
   * @param params
   * @param body
   * @returns
   */
  async signUp(author: any, params: any, body: any) {
    logger.info(
      `INSIDE USER SIGN-UP SERVICE ${JSON.stringify({
        author,
        params,
        body,
      })}`
    );

    // validate request payload
    const validationResult: ValidationResultInterface =
      validateUserRequestPayload(body);
    if (!validationResult.status) {
      throw new Error(validationResult.message);
    }

    // check in Db if the user already exists.
    const existingUser = await this.userDao.get(body.userEmail);
    if (existingUser) {
      throw new Error("User already registered with the emailId. Please login");
    }

    // create product object
    const user: UserInterface = this.createUserRequestPayload(body);

    // Inserting product into database
    const result: UserInterface = await this.userDao.create(user);

    // sending user payload
    const responsePayload = this.createJWTPayload(result);

    return responsePayload;
  }

  /**
   * Login service layer.
   * @param author
   * @param params
   * @param body
   * @returns
   */
  async login(author: any, params: any, body: any) {
    logger.info(
      `INSIDE LOGIN USER SERVICE ${JSON.stringify({
        author,
        params,
        body,
      })}`
    );

    // validate request payload
    const validationResult: ValidationResultInterface =
      validateUserRequestPayload(body);
    if (!validationResult.status) {
      throw new Error(validationResult.message);
    }

    // fetching user data based on email.
    const userData = await this.userDao.get(body.userEmail);

    // authenticating user password.
    const validateUserPasswordResult = validateUserPassword(
      body.password,
      userData.password
    );
    if (!validateUserPasswordResult.status) {
      throw new Error(validateUserPasswordResult.message);
    }

    // creating jwt payload.
    const jwtPayload = this.createJWTPayload(body);

    // generate token using JWT payload.
    const jwtToken: string = createJWTToken(jwtPayload);

    return {
      authorizationToken: jwtToken,
      ...jwtPayload,
    };
  }

  /**
   * create a user payload.
   * @param payload
   * @returns UserInterface
   */
  private createUserRequestPayload(payload: any): UserInterface {
    return {
      userId: uuidv4(),
      createdTS: new Date().toISOString(),
      updatedTS: new Date().toISOString(),
      ...payload,
      // hashing the password using sha256 algorithm
      password: createHashPassword(payload.password),
    };
  }

  /**
   * Create a JWT payload.
   * @param body
   * @returns
   */
  private createJWTPayload(body: any) {
    return {
      userName: body.userName,
      userEmail: body.userEmail,
      userRole: body.userRole,
    };
  }
}
