

const express = require("express");
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT|| 8081;
const app = express();
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes")
const theatreRoute = require('./routes/theatreRoutes')
const showRoutes= require('./routes/showRoutes')
const bookingRoute= require('./routes/bookingRoutes')
app.use(express.json());
app.use(express.static('./public'));
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes)
app.use('/api/theatres' , theatreRoute )
app.use('/api/shows',showRoutes)
app.use('/api/bookings',bookingRoute)
app.listen(port, () => {
  console.log("Server Running");
});
