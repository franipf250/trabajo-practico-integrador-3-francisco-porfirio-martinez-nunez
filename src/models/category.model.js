import { model, Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    events:{
          type: Types.ObjectId,
          ref: "Event"
        },
  },
  {
    timestamps: true, //[cite: 3]
    versionKey: false, //[cite: 3]
  }
);


categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

export const CategoryModel = model("Category", categorySchema);