import QuestionInterface from "../../utils/interfaces/QuestionInterface";
import ValidationResultInterface from "../../utils/interfaces/validationResultInterface";
import logger from "../../utils/serviceUtils/loggerUtil";
import { QuestionDao } from "./questionDao";
import { validateQuestionRequestPayload } from "./questionValidator";
import { v4 as uuidv4 } from "uuid";

export class QuestionService {
  private QuestionDao;

  constructor() {
    this.QuestionDao = new QuestionDao();
  }

  async create(author: any, params: any, body: any) {
    logger.info(
      `INSIDE CREATE QUESTION SERVICE ${JSON.stringify({
        author,
        params,
        body,
      })}`
    );

    // validate request payload
    const validationResult: ValidationResultInterface =
      validateQuestionRequestPayload(body);
    if (!validationResult.status) {
      throw new Error(validationResult.message);
    }

    // create Question object
    const Question: QuestionInterface = this.createQuestionRequestPayload(body);

    // Inserting Question into database
    const result: QuestionInterface = await this.QuestionDao.create(Question);

    // returning result
    return result;
  }

  async update(author: any, params: any, body: any) {
    logger.info(
      `INSIDE UPDATE QUESTION SERVICE ${JSON.stringify({
        author,
        params,
        body,
      })}`
    );

    // validate request payload
    const validationResult: ValidationResultInterface =
      validateQuestionRequestPayload(body);

    if (!validationResult.status) {
      throw new Error(validationResult.message);
    }

    // create Question object
    const Question: QuestionInterface = this.updateQuestionRequestPayload(body);

    // Updating Question into database
    const result: QuestionInterface = await this.QuestionDao.update(Question);

    // returning result
    return result;
  }

  async get(author: any, params: any) {
    logger.info(`INSIDE GET QUESTION SERVICE ${JSON.stringify(params)}`);

    // Fetching Question from database
    const result: QuestionInterface = await this.QuestionDao.get(params);

    // returning result
    return result;
  }

  async getAll(author: any, params: any) {
    logger.info(`INSIDE GET ALL Question SERVICE ${JSON.stringify(params)}`);

    // Fetching Question into database
    const result: QuestionInterface = await this.QuestionDao.getAll(params);

    // returning result
    return result;
  }

  async delete(author: any, params: any) {
    logger.info(`INSIDE DELETE QUESTION SERVICE ${JSON.stringify(params)}`);

    // Deleting Question from database
    const result: QuestionInterface = await this.QuestionDao.delete(params);

    // returning result
    return result;
  }

  private createQuestionRequestPayload(payload: any): QuestionInterface {
    return {
      questionId: uuidv4(),
      isActive: true,
      createdTS: new Date().toISOString(),
      updatedTS: new Date().toISOString(),
      ...payload,
    };
  }

  private updateQuestionRequestPayload(payload: any): QuestionInterface {
    return {
      updatedTS: new Date().toISOString(),
      ...payload,
    };
  }
}
