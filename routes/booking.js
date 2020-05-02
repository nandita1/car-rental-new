const express = require("express");
const router = express.Router();

const {
    userById,
    requireSignin,
    isAuth
} = require("../controllers/auth");

const {
    carById
} = require("../controllers/car");

const {create, returnCar } = require("../controllers/booking")

router.get("/bookings/returnCar/:userId/:bookingId", requireSignin, isAuth,returnCar)
router.post("/bookings/create/:userId/:carId", requireSignin, isAuth, create);
router.param("userId", userById);
router.param("carId", carById);
module.exports = router;