import { Schema, model, Types } from "mongoose"; // Asegúrate de incluir 'Types' aquí

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Ejemplo si usas relaciones que requieran Types:
    // someField: {
    //   type: Types.ObjectId,
    //   ref: "User"
    // }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CategoryModel = model("Category", categorySchema);