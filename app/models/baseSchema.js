const mongoose = require('mongoose');

class BaseSchema extends mongoose.Schema {
  constructor(fields, option) {
    const baseFields = {
      createdAt: {
        type: Date,
        default: () => new Date().getTime()+(7 * 60 * 60 * 1000),
        required: true,
      },
      updatedAt: {
        type: Date,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      isActive: {
        type: Boolean,
        default: true,
        required: true,
      },
    };

    const mergedFields = Object.assign({}, fields, baseFields);

    super(mergedFields, option);
  }
}

module.exports = BaseSchema;
