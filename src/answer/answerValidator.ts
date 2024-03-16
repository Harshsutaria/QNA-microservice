import ValidationResultInterface from "../../utils/interfaces/validationResultInterface";

/**
 * Validate review payload
 * @param payload
 * @returns ValidationResultInterface
 */
export function validateAnswerRequestPayload(
  payload: any
): ValidationResultInterface {
  const validationResult: ValidationResultInterface = {
    status: true,
    message: `Answer payload validation successful`,
  };

  if (!payload.questionId) {
    validationResult.status = false;
    validationResult.message =
      "Question Information is mandatory for answering question";
    return validationResult;
  }

  if (!payload.userId) {
    validationResult.status = false;
    validationResult.message =
      "User information is mandatory answering question";
    return validationResult;
  }

  if (!payload.answer) {
    validationResult.status = false;
    validationResult.message = "Please Add Proper Answer for the Question";
    return validationResult;
  }

  return validationResult;
}
