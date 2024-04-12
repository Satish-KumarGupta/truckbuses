import mongoose from "mongoose";
const AuthorSchema=new mongoose.Schema({
    name:String,
    company:String,

});
export const Author=mongoose.models.author || mongoose.model("author",AuthorSchema);