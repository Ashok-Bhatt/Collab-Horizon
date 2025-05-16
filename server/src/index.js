const express = require("express")
const app = express()

require('dotenv').config({
    path : './.env'
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Listening to app on PORT no ${process.env.PORT}`);
})