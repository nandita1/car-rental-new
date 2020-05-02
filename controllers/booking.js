const formidable = require("formidable");
const Car = require("../models/car");
const Booking = require("../models/booking");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    //form.keepExtensions = true;
    form.parse(req, (err, fields) => {
        if (err)
            return res.status(400).json({
                error: "form could not be submitted",
            });
        //let car = new Car(fields);
        const { name, phone, issueDate, returnDate } = fields;
        if (!name || !phone || !issueDate || !returnDate) {
            return res.status(400).json({
                error: "All fields are required",
            });
        }
        let newIssueDate = new Date(issueDate);
        let error = false;


        for(let el of req.car.bookings){
            if(el.issueDate<= newIssueDate && el.returnDate >= newIssueDate){
                return res.status(400).json({
                    error: "Car is not available",
                });
            }
        }


        let booking = new Booking({
            customer: {
                id: req.profile._id,
                name: name,
                phone: phone
            },
            car: req.car._id,
            issueDate: issueDate,
            returnDate: returnDate
        })
        
        booking.save((err, result) => {
            if (err)
                return res.status(400).json({
                    error: errorHandler(err),
                });
            let car = req.car;
            car.bookings.push(result._id)
            let bookingResult = result;
            car.save((err,result)=>{
                if(err)
                    return res.status(400).json({
                        error: errorHandler(err),
                    });
                return res.json(bookingResult);
            })
            
        });
    });
        
    //return res.json({hi: "hi"})
}

exports.returnCar = (req, res) => {
    Booking.findById(req.params.bookingId).exec((err, bookingresult) => {
        if(err || !bookingresult) 
            return res.status(400).json({
                    error: "No such bookings",
            });
        console.log(bookingresult)
        Car.findByIdAndUpdate(bookingresult.car, {$pull: {bookings: bookingresult._id}}).exec((err, result)=>{
            if(err)
                return res.status(400).json({
                        error: errorHandler(err),
                });
                return res.json(result);
            })
        
    })
}

