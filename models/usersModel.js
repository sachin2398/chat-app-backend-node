const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true ,unique:true},
  password: {
    type: String,
    required: true,
  },

  pic: {
    type: String,
   
    deafult:
      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740&t=st=1727530740~exp=1727531340~hmac=0bb7e69a0148be3425d42d948570f238acaeeda62e38e57283f38b6ec31c9fb8",
  },
}, {
    timestamps:true,
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.pre('save', async function (next) {
  if (!this.isModified) {
    next();
   
  }
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
})


const User = mongoose.model("User", userSchema);
module.exports =  User ;