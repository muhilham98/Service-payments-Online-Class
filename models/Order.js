const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  courseId: {
      type: Number,
      required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  snapUrlMidtrans: {
    type: String,
  },
  dataOrderCourse: {
      type: Object
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

orderSchema.plugin(mongoosePaginate);


module.exports = mongoose.model("Order", orderSchema);
