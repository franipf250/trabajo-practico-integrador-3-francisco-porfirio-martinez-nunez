import { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
        firstName:{
            type:String
        },
        lastName:{
            type:String
        },
        birthDate:{
            type:Date
        },
        phone:{
            type:String
        },
        
    },
    // profile (relacion embebida)
    role:{
        type:String,
        enum:
            ['user','admin'],
        default: 'user'
    },
    events:{
      type: Types.ObjectId,
      ref: "Event"
    },


    // una propiedad de tipo objeto
    // address: {
    //   street: {
    //     type: String,
    //     required: true,
    //   },
    //   city: {
    //     type: String,
    //     required: true,
    //   },
    //   country: {
    //     type: String,
    //     required: true,
    //   },
    // },

  },
  
  {
    versionKey: false,
  },
);
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });
export const UserModel = model("User", userSchema);