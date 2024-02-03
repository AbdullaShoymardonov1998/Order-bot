const RequiredSchema = {
  UZ: {
    type: String,
    required: true,
  },
  RU: {
    type: String,
    required: true,
  },
};

const DefaultSchema = {
  UZ: {
    type: String,
    default: "",
  },
  RU: {
    type: String,
    default: "",
  },
};

module.exports = {
  LanguageRequired: RequiredSchema,
  LanguageDefault: DefaultSchema,
};
