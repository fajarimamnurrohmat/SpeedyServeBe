const { CategoryPayloadSchema } = require("./schema");
const CategoryValidator = {
    validateCategoryPayload: (payload) => {
        const validationResult = CategoryPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new Error(validationResult.error.message);
        }
    },
};
module.exports = CategoryValidator;
