const formidable = require("formidable");
const Car = require("../models/car");
const fs = require("fs")
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.carById = (req, res, next, id) => {
    Car.findById(id).populate("bookings").exec((err, car) => {
        if (err || !car) {
            return res.status(400).json({
                error: "car not found",
            });
        }
        req.car = car;
        next();
    });
};
exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err)
            return res.status(400).json({
                error: "form could not be submitted",
            });
        let car = new Car(fields);
        const { model, vehicleNo, rent, seatingCapacity } = fields;

        if (!model || !vehicleNo || !rent || !seatingCapacity) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        if (files.photo) {
            car.photo.data = fs.readFileSync(files.photo.path);
            car.photo.contentType = files.photo.type;
        }

        car.save((err, result) => {
            if (err)
                return res.status(400).json({
                    error: errorHandler(err),
                });
            return res.json(result);
        });
    });
        
    //return res.json({hi: "hi"})
}

exports.getAvailableCars = (req, res) => {
    let newDate = new Date(req.query.date)
    let final = []
    /*Car.find({ "bookings.issueDate": {$gt: newDate}, "bookings.returnDate": {$lt: newDate} }).populate("bookings", "_id issueDate returnDate").exec((err, result) => {
        console.log(result)
        res.json(result)
    })*/
    console.log(newDate)
    Car.find({}).select("-photo").populate({path: "bookings", match: {issueDate: {$lte: newDate}, returnDate: {$gte: newDate}}}).exec((err, result) => {
        if (err)
                return res.status(400).json({
                    error: errorHandler(err),
                });
        result.forEach((el) => {
            if(el.bookings.length === 0)
                final.push(el)
        })
        return res.json(final);
    })
}

exports.list = (req, res) => {
    Car.find({}).select("-photo").populate("bookings").exec((err, result)=>{
        if (err)
                return res.status(400).json({
                    error: errorHandler(err),
                });
        return res.json(result)
    })
}

exports.read = (req, res) => {
    req.car.photo = undefined;
    return res.json(req.car);
};

exports.photo = (req, res, next) => {
    if (req.car.photo.data) {
        res.set(("Content-Type", req.car.photo.contentType));
        return res.send(req.car.photo.data);
    }
    next();
};

exports.filterCars = (req, res) => {
    let findArgs = {}
    for(let key in req.query){
        if(key === 'rent'){
            findArgs[key] = {
                $gte: req.query[key][0],
                $lte: req.query[key][1]
            };
        }
        else if(key === 'model'){
            findArgs[key] = { $regex: req.query[key], $options: "i" };
        }
        else{
            findArgs[key] = req.query[key]
        }
    }
    console.log(findArgs)
    Car.find(findArgs).exec((err, result) => {
        if (err)
            return res.status(400).json({
                error: errorHandler(err),
            });
        return res.json(result)
    })
    //res.json({hi:"hi"})
}

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    //form.keepExtensions = true;
    form.parse(req, (err, fields) => {
        if (err)
            return res.status(400).json({
                error: "form could not be submitted",
            });
        let car = req.car;

        if(car.bookings.length > 0)
            return res.status(400).json({
                error: "cannot update booked cras",
            });

        const { model, vehicleNo, rent, seatingCapacity } = fields;
        
        if (!model || !vehicleNo || !rent || !seatingCapacity) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }

        car.model = model;
        car.vehicleNo = vehicleNo;
        car.rent = rent;
        car.seatingCapacity = seatingCapacity;
        car.save((err, result) => {
            if (err)
                return res.status(400).json({
                    error: errorHandler(err),
                });
            return res.json(result);
        });
    });
}

exports.remove = (req, res) => {
    let car = req.car;
    if(car.bookings.length > 0)
        return res.status(400).json({
            error: "cannot delete booked cras",
        });
    car.remove((err, deletedCar) => {
        if (err)
        return res.status(400).json({
            error: errorHandler(err),
        });
        res.json({
        message: "Deleted successfully",
        });
    });
}