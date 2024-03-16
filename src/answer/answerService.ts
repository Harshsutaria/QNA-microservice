import AnswerInterface from "../../utils/interfaces/AnswerInterface";
import ValidationResultInterface from "../../utils/interfaces/validationResultInterface";
import logger from "../../utils/serviceUtils/loggerUtil";
import { AnswerDao } from "./answerDao";
import { validateAnswerRequestPayload } from "./answerValidator";
import { v4 as uuidv4 } from "uuid";

export class AnswerService {
  private answerDao;

  constructor() {
    this.answerDao = new AnswerDao();
  }

  async create(author: any, params: any, body: any) {
    logger.info(
      `INSIDE CREATE ANSWER SERVICE ${JSON.stringify({
        author,
        params,
        body,
      })}`
    );

    // validate request payload
    const validationResult: ValidationResultInterface =
      validateAnswerRequestPayload(body);
    if (!validationResult.status) {
      throw new Error(validationResult.message);
    }

    // create answer object
    const answer: AnswerInterface = this.createAnswerRequestPayload(body);

    // Inserting answer into database
    const result: AnswerInterface = await this.answerDao.create(answer);

    // returning result
    return result;
  }

  async get(author: any, params: any) {
    logger.info(`INSIDE GET ANSWER SERVICE ${JSON.stringify(params)}`);

    // Fetching review from database
    const result: AnswerInterface = await this.answerDao.get(params);

    // returning result
    return result;
  }

  async getAll(author: any, params: any) {
    logger.info(`INSIDE GET ALL ANSWER SERVICE ${JSON.stringify(params)}`);

    // Fetching Review into database
    const result: AnswerInterface = await this.answerDao.getAll(params);

    // returning result
    return result;
  }

  private createAnswerRequestPayload(payload: any): AnswerInterface {
    return {
      answerId: uuidv4(),
      createdTS: new Date().toISOString(),
      updatedTS: new Date().toISOString(),
      ...payload,
    };
  }
}
