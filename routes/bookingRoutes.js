const stripe= require('stripe')(process.env.stripe_key)
const router= require('express').Router()
const Booking=require('../models/bookingModel')
const Show=require('../models/showModel')
const authMiddleware=require('../middlewares/authMiddleware')

router.post('/make-payment',async(req,res)=>{
    try {
        const {token,amount }=req.body
        const customer= await stripe.customers.create({
            email:token.email,
            source:token.id
        })
   const paymentIntent=await stripe.paymentIntents.create({
    amount:amount,
    currency:'CAD',
    customer: customer.id,
    payment_method_types:['card'],
    receipt_email:token.email,
    description: "token has been assigned to the movie"
   })
const transactionID=paymentIntent.id;
res.send({
    success:true,
    message:"payment Successful  ticket(s) Booked",
    data:transactionID
})
    }
    catch(err){
        res.send({
            success:false,
            message:err.message
        })
    }
})
router.post('/book-show',  async (req, res) => {
    try{
        const newBooking = new Booking(req.body);
        await newBooking.save();

        const show = await Show.findById(req.body.show).populate("movie");
        const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
        await Show.findByIdAndUpdate(req.body.show, { bookedSeats: updatedBookedSeats });
        res.send({
            success: true,
            message: 'New Booking done!',
            data: newBooking
        });
    }catch(err){
        res.send({
            success: false,
            message: err.message
        });
    }
});

router.get("/get-all-bookings",authMiddleware, async (req, res) => {
    try{
        const bookings = await Booking.find({ user: req.body.userId })
        .populate("user")
        .populate("show")
            .populate({
                path: "show",
                populate: {
                    path: "movie",
                    model: "movies"
                }
            })
            .populate({
                path: "show",
                populate: {
                    path: "theatre",
                    model: "theatres"
                }
            });
        
        res.send({
            success: true,
            message: "Bookings fetched!",
            data: bookings
        })

    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
});

module.exports = router;