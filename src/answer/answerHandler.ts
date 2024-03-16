import { AnswerService } from "./answerService";
import HTTPConst from "../../utils/serviceUtils/HttpStatusCodes";
import logger from "../../utils/serviceUtils/loggerUtil";
import { ROLE } from "../constants/service-constants";
import { verifyJWT } from "../../utils/serviceUtils/jwtLib";

const handler: any = {};

handler.create = async function (req: any, res: any) {
  logger.info(`INSIDE SUBMIT ANSWER HANDLER`);
  let { author, params, body } = getServiceArgs(req, res);

  // validated JWT token.
  const validationResult = validateAuthorizationToken(author);

  // Validating user based on the role
  if (![ROLE.student].includes(validationResult.userRole)) {
    return res.json({
      code: HTTPConst.clientError.UNAUTHORIZED,
      message: "USER IS UNAUTHORIZED FOR THIS ACTION",
    });
  }

  const answerService = new AnswerService();

  try {
    const result = await answerService.create(author, params, body);
    return res.json({
      code: HTTPConst.success.CREATED,
      message: "Answer submitted SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Answer submission failed!!!",
      errorMessage: error.message,
    });
  }
};

handler.get = async function (req: any, res: any) {
  const { author, params } = getServiceArgs(req, res);

  // validated JWT token.
  const validationResult = validateAuthorizationToken(author);

  if (!params.answerId) {
    return res.json({
      code: HTTPConst.clientError.BAD_REQUEST,
      message: "Answer ID is mandatory",
    });
  }

  const answerService = new AnswerService();

  try {
    const result = await answerService.get(author, params);
    return res.json({
      code: HTTPConst.success.OK,
      message: "Answer Fetched SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Answer Fetching Failed",
      errorMessage: error.message,
    });
  }
};

handler.getAll = async function (req: any, res: any) {
  const { author, params } = getServiceArgs(req, res);

  // validated JWT token.
  const validationResult = validateAuthorizationToken(author);

  // Validating user based on the role
  if (![ROLE.teacher].includes(validationResult.userRole)) {
    return res.json({
      code: HTTPConst.clientError.UNAUTHORIZED,
      message: "USER IS UNAUTHORIZED FOR THIS ACTION",
    });
  }

  if (!params.questionId) {
    return res.json({
      code: HTTPConst.clientError.BAD_REQUEST,
      message: "QUESTION ID IS MANDATORY TO FETCH ALL ANSWERS",
    });
  }

  const answerService = new AnswerService();

  try {
    const result = await answerService.getAll(author, params);
    return res.json({
      code: HTTPConst.success.OK,
      message: "Answer Fetched SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Answer Fetching Failed",
      errorMessage: error.message,
    });
  }
};

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

handler.analytics = async function (req: any, res: any) {
  logger.info(`INSIDE ANALYTICS QUESTION HANDLER`);
  let { author, params } = getServiceArgs(req, res);

  // validated JWT token.
  const validationResult = validateAuthorizationToken(author);

  if (!params.questionId) {
    return res.json({
      code: HTTPConst.clientError.BAD_REQUEST,
      message: "QUESTION ID IS MANDATORY TO GENERATE ANALYTICS",
    });
  }

  const answerService = new AnswerService();

  try {
    const result = await answerService.analytics(author, params);
    return res.json({
      code: HTTPConst.success.OK,
      message: "Result Fetched SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Result Fetching failed!!!",
      errorMessage: error.message,
    });
  }
};

/**
 * Wrapper to validate JWT token
 * @param author
 * @returns
 */
function validateAuthorizationToken(author: any) {
  const validationResult: any = verifyJWT(author.token);
  if (validationResult.errorMessage) {
    throw new Error(validationResult.errorMessage);
  }

  return validationResult;
}

export default handler;
