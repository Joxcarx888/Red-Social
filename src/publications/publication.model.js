import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El título es requerido"],
      maxLength: [100, "No más de 100 caracteres"],
      minLength: [5, "Mínimo 5 caracteres"],
      trim: true,
    },
    text: {
      type: String,
      required: [true, "El texto es requerido"],
      maxLength: [5000, "No más de 5000 caracteres"],
      minLength: [10, "Mínimo 10 caracteres"],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es requerido"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es requerida"],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Post", PostSchema);
