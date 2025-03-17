const { OrderPayloadSchema, DetailOrderPayloadSchema, UpdateStatusOrderSchema } = require("./schema");

const OrderValidator = {
  validateOrderPayload: (payload) => {
    const validationResult = OrderPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },

  validateDetailOrderPayload: (payload) => {
    const validationResult = DetailOrderPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },

  validateUpdateStatusOrder: (payload) => {
    const validationResult = UpdateStatusOrderSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  },
};

module.exports = OrderValidator;
