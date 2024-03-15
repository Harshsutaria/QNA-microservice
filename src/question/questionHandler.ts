import { QuestionService } from "./questionService";
import HTTPConst from "../../utils/serviceUtils/HttpStatusCodes";
import logger from "../../utils/serviceUtils/loggerUtil";
import { ROLE } from "../constants/service-constants";
import { verifyJWT } from "../../utils/serviceUtils/jwtLib";

/**
 * container for setting questionHandler
 */
const handler: any = {};

handler.create = async function (req: any, res: any) {
  let { author, params, body } = getServiceArgs(req, res);

  // validated JWT token.
  const validationResult = validateAuthorizationToken(author);

  // Validating user based on the role
  if (![ROLE.teacher].includes(validationResult.userRole)) {
    return res.json({
      code: HTTPConst.clientError.UNAUTHORIZED,
      message: "USER IS UNAUTHORIZED FOR THIS ACTION",
    });
  }

  const questionService = new QuestionService();

  try {
    const result = await questionService.create(author, params, body);
    return res.json({
      code: HTTPConst.success.CREATED,
      message: "Question Listed SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Question Listing Failed!!!",
      errorMessage: error.message,
    });
  }
};

handler.update = async function (req: any, res: any) {
  const { author, params, body } = getServiceArgs(req, res);

  // validated JWT token.
  const validationResult = validateAuthorizationToken(author);

  // Validating user based on the role
  if (![ROLE.teacher].includes(validationResult.userRole)) {
    return res.json({
      code: HTTPConst.clientError.UNAUTHORIZED,
      message: "USER IS UNAUTHORIZED FOR THIS ACTION",
    });
  }

  const questionService = new QuestionService();

  try {
    const result = await questionService.update(author, params, body);
    return res.json({
      code: HTTPConst.success.ACCEPTED,
      message: "Question Updated SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Question updation Failed!!!",
      errorMessage: error.message,
    });
  }
};

handler.get = async function (req: any, res: any) {
  const { author, params } = getServiceArgs(req, res);

  if (!params.questionId) {
    return res.json({
      code: HTTPConst.clientError.BAD_REQUEST,
      message: "Question ID is mandatory",
    });
  }

  const questionService = new QuestionService();

  try {
    const result = await questionService.get(author, params);
    return res.json({
      code: HTTPConst.success.OK,
      message: "Question Fetched SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Question fetching failed!!!!",
      errorMessage: error.message,
    });
  }
};

handler.getAll = async function (req: any, res: any) {
  const { author, params } = getServiceArgs(req, res);

  if (!params.teacherId) {
    return res.json({
      code: HTTPConst.clientError.BAD_REQUEST,
      message: "Teacher ID is mandatory",
    });
  }

  const questionService = new QuestionService();

  try {
    const result = await questionService.getAll(author, params);
    return res.json({
      code: HTTPConst.success.OK,
      message: "Questions Fetched SuccessFully!!!",
      result,
    });
  } catch (error: any) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Questions Fetching Failed",
      errorMessage: error.message,
    });
  }
};

handler.delete = async function (req: any, res: any) {
  const { author, params } = getServiceArgs(req, res);

  if (!params.questionId) {
    return res.json({
      code: HTTPConst.clientError.BAD_REQUEST,
      message: "questionId ID is mandatory",
    });
  }

  // validated JWT token.
  const validationResult = validateAuthorizationToken(author);

  // Validating user based on the role
  if (![ROLE.teacher].includes(validationResult.userRole)) {
    return res.json({
      code: HTTPConst.clientError.UNAUTHORIZED,
      message: "USER IS UNAUTHORIZED FOR THIS ACTION",
    });
  }

  const questionService = new QuestionService();

  try {
    const result = await questionService.delete(author, params);
    return res.json({
      code: HTTPConst.success.OK,
      message: "Question Deletion SuccessFully!!!",
      result,
    });
  } catch (error) {
    return res.json({
      code: HTTPConst.serverError.INTERNAL_SERVER,
      message: "Question Deletion Failed",
      error,
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
