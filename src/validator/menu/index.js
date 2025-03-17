const { MenuPayloadSchema } = require("./schema");

const MenuValidator = {
    validateMenuPayload: (payload) => {
        const validationResult = MenuPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new Error(validationResult.error.message);
        }
    },
};

module.exports = MenuValidator;
