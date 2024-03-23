import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      minlength: 6,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "Guest",
    },
  },
  { timestamps: true } // createdAt, updatedAt => Member since <createdAt>
);

// mongoose figures to have users collection
const User = mongoose.model("User", userSchema);
export default User;
