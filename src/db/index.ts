/* eslint-disable no-console */
import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const uri = "mongodb://127.0.0.1:27017/octopus?authSource=admin";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, },);

const db = mongoose.connection.once("open", () => {
    console.log("MongoDb connection created successfully!",);
},).on("error", () => {
    console.log("MongoDB connection error:",);
},);

export default db;
