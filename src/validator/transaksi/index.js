const { TransactionPayloadSchema } = require("./schema");

const TransactionValidator = {
    validateTransactionPayload: (payload) => {
        const validationResult = TransactionPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new Error(validationResult.error.message);
        }
    },
};

module.exports = TransactionValidator;
