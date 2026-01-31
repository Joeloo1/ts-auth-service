import mongoose, { Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

export interface IUser {
  username?: string;
  name: string;
  email: string;
  isVerified: boolean;
  role: "user" | "admin";
  photo?: string;
  password: string;
  passwordConfirm?: string;
  correctPassword(
    plainPassword: string,
    userPassword: string,
  ): Promise<boolean>;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid Email"],
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      trim: true,
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// HASHING PASSWORD
userSchema.pre("save", async function () {
  // Check if the password is modefiy
  if (!this.isModified("password")) return;

  // Hash password
  this.password = await bcrypt.hash(this.password, 10);

  // Remove passwordConfirm
  this.passwordConfirm = undefined;
});

// COMPARE PASSWORD
userSchema.methods.correctPassword = async function (
  plainPassword: string,
  userPassword: string,
) {
  return bcrypt.compare(plainPassword, userPassword);
};

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
