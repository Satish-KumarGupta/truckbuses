import {con} from '../../lib/db';
import { Author } from '@/app/lib/model/author';
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    let data=[]
    try{
      await mongoose.connect(process.env.MONGODB)
    
       data =await Author.find();
    }catch(err){
        data={Success:false,err}
    }

    return NextResponse.json({result:data,success:true})
}

export async function POST(request){
    await mongoose.connect(process.env.MONGODB)
    const payload=await request.json();
    let author=new Author(payload)
    const result=await author.save();
    return NextResponse.json({result,success:true})
}