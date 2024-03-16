import AnswerInterface from "../../utils/interfaces/AnswerInterface";
import logger from "../../utils/serviceUtils/loggerUtil";
import { Postgres } from "../../utils/serviceUtils/postgres/postgresUtil";
import { serviceConstants } from "../constants/service-constants";

export class AnswerDao {
  // setting dataBaseName for the dao class
  private dataBaseName: string = serviceConstants.DATABASE;

  // setting tableName for the dao class
  private tableName: string = serviceConstants.ANSWER_TABLE;

  // setting property for creating connection
  postgres: any;

  constructor() {
    // creating postgres client
    this.postgres = new Postgres();
  }

  async create(answer: AnswerInterface): Promise<AnswerInterface> {
    return this.createAnswerInPostgres(answer);
  }

  async get(params: any): Promise<AnswerInterface> {
    return this.getAnswerFromPostgres(params.answerId);
  }

  async getAll(params: any): Promise<AnswerInterface> {
    return this.getAnswersByQuestionId(params);
  }

  private async createAnswerInPostgres(
    answer: AnswerInterface
  ): Promise<AnswerInterface> {
    let data: any;
    logger.info(`Answer object is ${JSON.stringify(answer)}`);
    const sqlQuery: string = `INSERT INTO ${this.tableName}(
       "questionId","answerId","userId",
        "answer","createdTS",
        "updatedTS") values($1,$2,$3,$4,$5,$6)`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [
        answer.questionId,
        answer.answerId,
        answer.userId,
        answer.answer,
        answer.createdTS,
        answer.updatedTS,
      ]);
      logger.info(`Answer creation dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while inserting answer ${error}`);
      throw new Error(`Getting error while inserting answer ${error}`);
    }

    return answer;
  }

  private async getAnswerFromPostgres(
    answerId: string
  ): Promise<AnswerInterface> {
    let data: any;
    // Preparing sql update query
    const sqlQuery: string = `SELECT * FROM ${this.tableName} where "answerId" = $1`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [answerId]);
      logger.info(`Answer Fetch by Id dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while fetching Answer ${error}`);
      throw new Error(`Getting error while fetching Answer ${error}`);
    }

    return data;
  }

  /**
   * Check if user already submitted answer for the question.
   * @param userId
   * @param questionId
   * @returns
   */
  async getUserSubmissionFromPostgres(
    userId: string,
    questionId: string
  ): Promise<AnswerInterface> {
    let result: any;
    let data: any;
    // Preparing sql update query
    const sqlQuery: string = `SELECT * FROM ${this.tableName} where "userId" = $1 AND "questionId" = $2`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [userId, questionId]);
      logger.info(`Answer Fetch by Id dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while fetching Answer ${error}`);
      throw new Error(`Getting error while fetching Answer ${error}`);
    }

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }

    return result;
  }

  private async getAnswersByQuestionId(params: any): Promise<AnswerInterface> {
    // setting pagination params
    let data: any;
    const offset: number = params.offset || 0;
    const limit: number = params.limit || 10;
    const result: any = {
      count: 0,
      answers: [],
    };

    // Preparing sql update query
    const sqlQuery: string = `SELECT count(*)over(), * FROM ${this.tableName} where "questionId" = $1 offset ${offset} limit ${limit}`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [params.questionId]);
      logger.info(`Answer Fetch dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while fetching answer ${error}`);
      throw new Error(`Getting error while fetching answer ${error}`);
    }

    // returning data
    if (Array.isArray(data) && data.length) {
      result.count = data[0].count;
      result.answers = data;
    }

    return result;
  }
}
