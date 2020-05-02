const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
    signup,
    signin,
    signout,
    requireSignin,
} = require("../controllers/auth");

router.post(
    "/signup",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Invalid email type").isEmail(),
        check("password", "Password is required").notEmpty(),
        check("password")
            .isLength({ min: 6 })
            .withMessage("Password must contain atleast 6 characters")
            .matches(/\d/)
            .withMessage("Password must contain a number"),
    ],
    signup
);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
