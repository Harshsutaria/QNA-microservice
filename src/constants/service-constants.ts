export const APPLICATION_VERSION: string = "v1";

// @ts-ignore
export const APPLICATION_PORT: number = parseInt(process.env.APPLICATION_PORT);

export enum serviceConstants {
  DATABASE = "commondb",
  QUESTION_TABLE = "questions",
  ANSWER_TABLE = "answer",
  PROFILE_TABLE = "userProfileAuth",
}

export enum ROLE {
  teacher = "TEACHER",
  student = "STUDENT",
}
