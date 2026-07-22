const { ZxcvbnFactory } = require("@zxcvbn-ts/core");
const common = require("@zxcvbn-ts/language-common");
const english = require("@zxcvbn-ts/language-en");

const zxcvbn = new ZxcvbnFactory({
  dictionary: {
    ...common.dictionary,
    ...english.dictionary,
  },
  graphs: common.adjacencyGraphs,
  translations: english.translations,
});

const validatePasswordStrength = (password, userInputs = []) => {
  const result = zxcvbn.check(password, userInputs);

  return {
    isStrong: result.score >= 3,
    score: result.score,
    feedback: result.feedback,
  };
};

module.exports = validatePasswordStrength;