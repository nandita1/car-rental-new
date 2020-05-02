const express = require("express");
const router = express.Router();

const {
    userById,
    requireSignin,
    isAuth
} = require("../controllers/auth");

const {
    carById,
    create,
    getAvailableCars,
    filterCars,
    update,
    remove
} = require("../controllers/car");

router.post("/cars/create/:userId", requireSignin, isAuth, create);
router.put("/cars/update/:userId/:carId", requireSignin, isAuth, update);
router.delete("/cars/remove/:userId/:carId", requireSignin, isAuth, remove);
router.get("/cars/getAvailableCars", getAvailableCars);
router.get("/cars/filterCars", filterCars);

router.param("carId", carById);
router.param("userId", userById);
module.exports = router;