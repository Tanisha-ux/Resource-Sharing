import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type:String,
      required:true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    status: {
      type:String,
      enum: ["active","blocked"],
      default: "active"
    },

    resetPasswordToken: {
      type: String
    },
    
    resetPasswordExpires: {
      type: Date
    },

    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User=mongoose.model("User",userSchema);

export default User;