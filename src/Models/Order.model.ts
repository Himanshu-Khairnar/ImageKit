import mongoose, { Schema, model, models } from "mongoose"


interface IOrder {
    userID: mongoose.Types.ObjectId;
    productID: mongoose.Types.ObjectId;
    variant: {
        type: "SQUARE" | "WIDE" | "POTRAIT";
        price: number;
        license: "personal" | "commerical";
    };
    razorpayOrderId: string;
    razorpayPaymentId: string;
    Amount: number;
    status: "pending" | "completed" | "failed";
    downloadUrl?: string;
    previewUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>({
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productID: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: {
        type: {
            type: String,
            required: true,
            enum: ["SQUARE", "WIDE", "POTRAIT"]

        },
        price: { type: Number, required: true },
        license: {
            type: String,
            required: true,
            enum: ["personal", "commerical"]

        }
    },
    razorpayOrderId:{type:String,required:true},
    razorpayPaymentId:{type:String,required:true},
    Amount:{type:Number,required:true},
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "failed"],
        default:"pending"
    },
    downloadUrl:{type:String},
    previewUrl:{type:String}
},{timestamps:true})

const Order = models?.Order || model<IOrder>("Order",OrderSchema)

export default Order