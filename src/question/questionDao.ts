import QuestionInterface from "../../utils/interfaces/QuestionInterface";
import logger from "../../utils/serviceUtils/loggerUtil";
import { Postgres } from "../../utils/serviceUtils/postgres/postgresUtil";
import { serviceConstants } from "../constants/service-constants";

export class QuestionDao {
  // setting dataBaseName for the dao class
  private dataBaseName: string = serviceConstants.DATABASE;

  // setting tableName for the dao class
  private tableName: string = serviceConstants.QUESTION_TABLE;

  // setting property for creating connection
  postgres: any;

  constructor() {
    // creating postgres client
    this.postgres = new Postgres();
  }

  async create(question: QuestionInterface): Promise<QuestionInterface> {
    return this.createQuestionInPostgres(question);
  }

  async update(question: QuestionInterface): Promise<QuestionInterface> {
    return this.updateQuestionInPostgres(question);
  }

  async get(params: any): Promise<QuestionInterface> {
    return this.getQuestionFromPostgres(params.questionId);
  }

  async getAll(params: any): Promise<QuestionInterface> {
    return this.getAllQuestionFromPostgres(params);
  }

  async delete(params: any): Promise<QuestionInterface> {
    return this.deleteQuestionFromPostgres(params.questionId);
  }

  private async createQuestionInPostgres(
    question: QuestionInterface
  ): Promise<QuestionInterface> {
    let data: any;
    const sqlQuery: string = `INSERT INTO ${this.tableName}(
        "questionId","questionText",
        "teacherId","isActive",
        "ttl","createdTS",
        "updatedTS") values($1,$2,$3,$4,$5,$6,$7)`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [
        question.questionId,
        question.questionText,
        question.teacherId,
        question.isActive,
        question.ttl,
        question.createdTS,
        question.updatedTS,
      ]);
      logger.info(`Question creation dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while inserting question ${error}`);
      throw new Error(`Getting error while inserting question ${error}`);
    }

    return question;
  }

  private async updateQuestionInPostgres(
    question: QuestionInterface
  ): Promise<QuestionInterface> {
    let data: any;
    // Preparing sql update query
    const sqlQuery: string = `UPDATE ${this.tableName} 
        SET  
            "questionText"=$1 ,"isActive" = $2,
            "ttl"=$3,
            "updatedTS" = $4

        WHERE "questionId" = $5
        `;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [
        question.questionText,
        question.isActive,
        question.ttl,
        question.updatedTS,
        question.questionId,
      ]);
      logger.info(`Question Updation dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while updation Question ${error}`);
      throw new Error(`Getting error while updation Question ${error}`);
    }

    return question;
  }

  private async getQuestionFromPostgres(
    questionId: string
  ): Promise<QuestionInterface> {
    let data: any;
    // Preparing sql update query
    const sqlQuery: string = `SELECT * FROM ${this.tableName} where "questionId" = $1`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [questionId]);
      logger.info(`Question Fetch by Id dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while fetching question ${error}`);
      throw new Error(`Getting error while fetching question ${error}`);
    }

    return data;
  }

  private async getAllQuestionFromPostgres(
    params: any
  ): Promise<QuestionInterface> {
    // setting pagination params
    let data: any;
    const offset: number = params.offset || 0;
    const limit: number = params.limit || 10;
    const result: any = {
      count: 0,
      questions: [],
    };

    // Preparing sql update query
    const sqlQuery: string = `SELECT count(*)over(), * FROM ${this.tableName} where "isActive" = 'true' and "teacherId" = $1 offset ${offset} limit ${limit}`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [params.teacherId]);
      logger.info(`Questions Fetch dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while fetching questions ${error}`);
      throw new Error(`Getting error while fetching questions ${error}`);
    }

    // returning data
    if (Array.isArray(data) && data.length) {
      result.count = data[0].count;
      result.questions = data;
    }

    return result;
  }

  private async deleteQuestionFromPostgres(
    questionId: string
  ): Promise<QuestionInterface> {
    let data: any;
    // Preparing sql update query
    const sqlQuery: string = `DELETE FROM ${this.tableName} where "questionId" = $1`;

    // initializing connection with the database
    await this.postgres.connect(this.dataBaseName);

    // Trying to execute postgres query
    try {
      data = await this.postgres.execute(sqlQuery, [questionId]);
      logger.info(`Question Deletion by Id dao operation is successful`);
    } catch (error) {
      logger.error(`Getting error while deletion question ${error}`);
      throw new Error(`Getting error while deletion question ${error}`);
    }

    return data;
  }
}
