import {app} from "./app.js"
import connectToDB from "./db/index.js";
import {PORT} from "./config/config.js"

connectToDB()
.then(()=>{
    app.listen(PORT || 3000, ()=>{
        console.log(`Listening to app on PORT no ${PORT || 3000}`);
    })
})
.catch((error)=>{
    console.log("MongoDB Database Failed to connect! ", error);
})