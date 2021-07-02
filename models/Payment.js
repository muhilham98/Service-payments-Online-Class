const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');


const paymentSchema = new mongoose.Schema({
  orderId: {
    type: ObjectId,
    ref: 'Order'
  },
  // type: {
  //     type: String,
  //     required: true
  // },
  // status: {
  //   type: String
  // },
  price: {
    type: Number,
    required: true
  },
  responseData: {
      type: Object
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});
// - orderId : ObjectId
// - type : string
// - status : string
// - rawResponse : object/json
// - create_at : Date.now()

paymentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Payment", paymentSchema);
