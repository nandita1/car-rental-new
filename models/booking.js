const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            name: String,
            phone: Number
        },
        car: {
            type: ObjectId,
            ref: "Car"
        },
        issueDate: Date,
        returnDate: Date
    }
)
module.exports = mongoose.model("Booking", bookingSchema);