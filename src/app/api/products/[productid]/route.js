import { NextResponse } from "next/server";
import { Product } from "@/app/lib/model/products";
import mongoose from "mongoose";
import { con } from "@/app/lib/db";



export async function PUT(request,{params}){
    const userId=params.productid;
    console.log(userId);
    // id object create
    const filter={_id:userId}
    // get data json from user
    const payload=await request.json();
  
    await mongoose.connect(process.env.MONGODB)

    const result=await Product.findOneAndUpdate(filter,payload,{ new: true });
    return NextResponse.json({result,success:true})

}
// search by id
export async function GET(request,{params}){
    
    const userId=params.userid;
 
    console.log(userId);
    // id object create
    const record={_id:userId}
    // check the connection
    await mongoose.connect(con)

    const result=await Product.findOne(record);
    return NextResponse.json({result,success:true})
}

// export async function DELETE({params}){
//     const userId=params.userid;
//     console.log(userId);
//     const record={_id:userId}
//     console.log(record,userId);
//     // check the connection
//     await mongoose.connect(con)

//     const result=await User.deleteOne(record);
//     return NextResponse.json({result,massage:"Rocord deleted",success:true})
// }

export async function DELETE(request,content){
    console.log(content.params.userid);
    // get id
    const userId=content.params.userid;
    // id object create
    const record={_id:userId}
    // check the connection
    await mongoose.connect(con)

    const result=await Product.deleteOne(record);
    return NextResponse.json({result,success:true})
}
// export async function DELETE(content){
//     console.log("call this",content);
//     const record={_id:content.userid}
//     console.log(record);
//     // check the connection
//     await mongoose.connect(con)

//     const result=await User.deleteOne(record);
//     return NextResponse.json({result,massage:"Rocord deleted",success:true})
// }