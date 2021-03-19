import mongoose from "mongoose";

export default async function connect(uri: string,): Promise<void> {

    mongoose.Promise = global.Promise;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, },);
    mongoose.connection.once("open", () => {
        console.log("Test-npm-390 MongoDb connection created successfully!",);
    },).on("error", () => {
        console.log("Test-npm-390 MongoDB connection error:",);
    },);
}
