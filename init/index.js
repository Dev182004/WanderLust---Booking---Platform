const mongoose=require("mongoose");
const initdata =require("./data.js");
const Listing =require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then((res) => {
    console.log("server is connected to Database");
})
.catch((err) => {
    console.log(err);
});


const intiDB =async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj,owner:"68b81061b071a3e7b7bf95e6"}
    ));
    await Listing.insertMany(initdata.data);
    console.log("data is intialised");

};

intiDB();