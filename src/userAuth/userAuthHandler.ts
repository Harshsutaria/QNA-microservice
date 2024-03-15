import { UserAuthService } from "./userAuthService";
import HTTPConst from "../../utils/serviceUtils/HttpStatusCodes";
import logger from "../../utils/serviceUtils/loggerUtil";

/**
 * handler layer container for userAuth.
 */
const handler: any = {};

/**
 * Sign up Handler responsible for signing-up user.
 * @returns response
 */
handler.signUp = async function (req: any, res: any) {
  const { author, params, body } = getServiceArgs(req, res);

  const userAuthService = new UserAuthService();

  try {
    const result = await userAuthService.signUp(author, params, body);
    return res.json({
      code: HTTPConst.success.CREATED,
      message: "User Sign up SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "User Sign up Failed",
      errorMessage: error.message,
    });
  }
};

/**
 * Login handler responsible for authenticating user.
 * @returns response
 */
handler.login = async function (req: any, res: any) {
  const { author, params, body } = getServiceArgs(req, res);

  const userAuthService = new UserAuthService();

  try {
    const result = await userAuthService.login(author, params, body);
    return res.json({
      code: HTTPConst.success.ACCEPTED,
      message: "User Login SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "User Login Failed",
      errorMessage: error.message,
    });
  }
};

/**
 * Return author , params, body
 * @param req
 * @param res
 * @returns res
 */
function getServiceArgs(req: any, res: any) {
  const body = req.body || {};

  // Ref:- https://expressjs.com/en/api.html#req.params
  const params = {
    ...req.query,
    ...req.params,
  };

  const author = req.headers;

  return {
    author,
    params,
    body,
  };
}

export default handler;
