import mongoose, {  Schema, model, models } from "mongoose";


export interface IVariant {
    type: "SQUARE" | "WIDE" | "POTRAIT";
    price: number;
    license: "personal" | "commerical";
    createdAt?: Date;
    updatedAt?: Date;
    _id?:mongoose.Types.ObjectId
}

export interface IProduct {
    name: string;
    description: string;
    image: string;
    variants: IVariant[];
    createdAt?: Date;
    updatedAt?: Date;
}

const variantsSchema = new Schema<IVariant>(
    {
        type:
        {
            type: String,
            required: true,
            enum: ["SQUARE", "WIDE", "POTRAIT"]
        },
        price: { type: Number, required: true, min: 0 },
        license: { type: String, required: true, enum: ["personal", "commerical"] },
    },
    { timestamps: true }
);

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        variants: [variantsSchema],
    }, { timestamps: true }
)

const Product = models?.Product || model<IProduct>("Product", ProductSchema);

export default Product;
