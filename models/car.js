const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const carSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    vehicleNo: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    color:{
      type: String,
      trim: true,
      required: true,
    },
    rent: {
        type: Number,
        trim: true,
        required: true
    },
    seatingCapacity: {
        type: Number,
        trim: true,
        required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    //current bookings
    bookings: [{
      type: ObjectId,
      ref: "Booking"
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);