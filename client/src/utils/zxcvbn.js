import * as common from "@zxcvbn-ts/language-common";
import * as english from "@zxcvbn-ts/language-en";

import { ZxcvbnFactory } from "@zxcvbn-ts/core";

const zxcvbn = new ZxcvbnFactory({
  dictionary: {
    ...common.dictionary,
    ...english.dictionary,
  },
  graphs: common.adjacencyGraphs,
  translations: english.translations,
});

export const checkPasswordStrength = (password, userInputs = []) => {
  return zxcvbn.check(password, userInputs);
};