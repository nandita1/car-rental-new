const express = require("express");
const router = express.Router();

const {
    carById
} = require("../controllers/car");

const {create, returnCar } = require("../controllers/booking")

router.get("/bookings/returnCar/:bookingId", returnCar)
router.post("/bookings/create/:carId", create);

router.param("carId", carById);
module.exports = router;