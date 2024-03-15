import ValidationResultInterface from "../../utils/interfaces/validationResultInterface";

/**
 * Validate question payload
 * @param payload
 * @returns ValidationResultInterface
 */
export function validateQuestionRequestPayload(
  payload: any
): ValidationResultInterface {
  const validationResult: ValidationResultInterface = {
    status: true,
    message: `Question payload validation successful`,
  };

  if (!payload.questionText) {
    validationResult.status = false;
    validationResult.message =
      "Question cannot be empty. Please ask a valid question";
    return validationResult;
  }

  if (!payload.teacherId) {
    validationResult.status = false;
    validationResult.message =
      "Teacher information is mandatory for setting question";
    return validationResult;
  }

  return validationResult;
}
