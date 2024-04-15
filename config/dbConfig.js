const mongoose = require('mongoose')

mongoose.connect(process.env.DbUrl)

const connection = mongoose.connection

connection.on('connected' , ()=>{
    console.log('Connection Successful')
})
connection.on('error' , ()=>{
    console.log('Connection unsuccessful')
})