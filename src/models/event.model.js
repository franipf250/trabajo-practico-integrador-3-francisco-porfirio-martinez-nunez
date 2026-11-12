import { model, Schema, Types } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      venue: {
        type: String
      },
      adress:{
        type: String
      },
      city:{
        type: String
      }

    },
    category:{
          type: Types.ObjectId,
          ref: "Category"
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
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });
export const EventModel = model("Event", eventSchema);