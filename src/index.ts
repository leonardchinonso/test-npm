import * as crypt from "bcryptjs";
import mongoose, { Schema, Document, } from "mongoose";
import * as _ from "lodash";
import beautifyUnique from "mongoose-beautiful-unique-validation";

export function connect(uri: string,) {

    mongoose.Promise = global.Promise;
    // const uri = "mongodb://127.0.0.1:27017/octopus?authSource=admin";
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, },);
    const db = mongoose.connection.once("open", () => {
        console.log("Test-npm-390 MongoDb connection created successfully!",);
    },).on("error", () => {
        console.log("Test-npm-390 MongoDB connection error:",);
    },);
}

// INTERFACES
// UserInterface
export interface UserInterface extends Document{
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    password: string;
    passwordResetToken: string;
    phoneNumber: string;
    emailVerificationToken: string;
    emailVerified: boolean;
}

// NoteInterface
export interface NoteInterface extends Document{
    createdBy: mongoose.Types.ObjectId;
    title: string;
    body: string;
}

// TokenInterface
export interface TokenInterface extends Document{
    userId: mongoose.Types.ObjectId;
    token: any[];
}

const UserSchema: Schema = new Schema({
    firstName: {
        type: String,
        trim: true,
    },
    middleName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: [6, "Password should be more than 5 characters.",],
    },
    passwordResetToken: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    emailVerificationToken: {
        type: String,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
},);

UserSchema.plugin(beautifyUnique, { defaultMessage: "{VALUE} has been taken.", },);

UserSchema.methods = {
    toJSON(): Record<string, unknown> {
        const userObject = this.toObject();
        return _.pick(userObject,
            ["_id", "email", "firstName", "middleName", "lastName", "phoneNumber", "emailVerified",
            ],);
    },
};

// eslint-disable-next-line func-names
UserSchema.pre<UserInterface>("save", async function (next,) {
    if (this.isModified("password",)) {
        const salt = await crypt.genSalt(10,);
        this.password = await crypt.hash(this.password, salt,);
    }
    next();
},);

export const User = mongoose.connection.useDb("all-in-one-auth",).model<UserInterface>("User", UserSchema,);

// TokenSchema
const TokenSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: true,
    },
    token: [{
        value: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        lastSeen: {
            type: Date,
            required: true,
            unique: true,
            trim: true,
        },
    },],
},);

TokenSchema.methods = {
    toJSON(): Record<string, unknown> {
        const tokenObject = this.toObject();
        return _.pick(tokenObject,
            ["_id", "userId", "token",],);
    },
};

export const Token = mongoose.connection.useDb("all-in-one-auth",).model<TokenInterface>("Token", TokenSchema,);

// NoteSchema
const NoteSchema: Schema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
},);

NoteSchema.methods = {
    toJSON(): Record<string, unknown> {
        const noteObject = this.toObject();
        return _.pick(noteObject,
            ["_id", "createdBy", "title", "body",],);
    },
};

export const Note = mongoose.connection.useDb("all-in-one-notes",).model<NoteInterface>("Note", NoteSchema,);


