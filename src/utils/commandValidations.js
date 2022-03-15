const QUESTIONS = require("../constants/questions.js");
const { InvalidOptionArgumentError } = require("commander");

function hasUndefinedProp(obj) {
  const options = {
    ticker: undefined,
    fiat: undefined,
    operation: undefined,
  };

  return Object.values({ ...options, ...obj }).some(
    (v) => typeof v === "undefined"
  );
}

function validateTicker(ticker) {
  const key = ticker.toUpperCase();
  if (QUESTIONS[0].choices.includes(key) === false) {
    throw new InvalidOptionArgumentError("Not a valid crypto ticker.");
  }
  return key;
}

function validateFiat(fiat) {
  const key = fiat.toUpperCase();
  if (QUESTIONS[2].choices.includes(key) === false) {
    throw new InvalidOptionArgumentError("Not a valid fiat currency.");
  }
  return key;
}

function validateOperation(operation) {
  const key = operation.toUpperCase();
  if (QUESTIONS[2].choices.includes(key) === false) {
    throw new InvalidOptionArgumentError("Not a valid operation.");
  }
  return key;
}

function validatePayTypes(operation) {
  const key = operation.toUpperCase();
  if (QUESTIONS[3].choices.includes(key) === false) {
    throw new InvalidOptionArgumentError("Not a valid payment type.");
  }
  return key;
}

module.exports = {
  hasUndefinedProp,
  validateTicker,
  validateOperation,
  validateFiat,
  validatePayTypes,
};
