import mongoose from "mongoose";
const ImageSchema=new mongoose.Schema({
    thumbnail:String,
    original:String,
})
const GalleryItemSchema = new mongoose.Schema({
    thumbnail: String,
    original: String,
});
const TagSchema=new mongoose.Schema({
    name:String,
    slug:String,
});
const optionSchema=new mongoose.Schema({
    name:String,
    value:String
})
// const valuesSchema=new mongoose.Schema({
//     attribute_id:Number,
//     value:String
// })
const attributeSchema=new mongoose.Schema({
    slug:String,
    name:String,
    // values:[valuesSchema]
    values:[{
        attribute_id:Number,
        value:String
    }]  
})
const variationSchema=new mongoose.Schema({
    attribute_id:Number,
    value:String,
    attribute:attributeSchema

})


const variationOptionSchema=new mongoose.Schema({
   title:String,
   price:Number,
   sale_price:String,
   quantity:Number,
   is_disable:Number,
   sku:String,
   options:[optionSchema]
})
const ProductSchema=new mongoose.Schema({
   
    name:String,
    slug:String,
    description:String,
    images:[ImageSchema],
    gallery:[GalleryItemSchema],
    quantity:Number,
    price:String,
    sale_price:String,
    brand:String,
    weight:String,
    tag:[TagSchema],
    product_type:String,
    max_price:Number,
    min_price:Number,
    variations:[variationSchema],
    variation_options:[variationOptionSchema],


});
export const Product=mongoose.models.products || mongoose.model("products",ProductSchema);