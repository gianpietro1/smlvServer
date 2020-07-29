const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: String,
  cellphone: String,
  qualifications: String,
  company: String,
  companyRole: String,
  companyEmail: String,
  instagram: String,
  twitter: String,
  linkedin: String,
  city: String,
  country: String,
  avatarUrl: String,
  avatarUrlMini: String,
  searchTags: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  lastUpdated: {
    type: Date,
    default: "2020-07-20T11:28:03.501Z",
  },
  pushToken: String,
});

// Always hash & salt new passwords
memberSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Compare provided password with stored password
memberSchema.methods.comparePassword = function(candidatePassword) {
  const user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      if (!isMatch) {
        return resolve(false);
      }
      resolve(true);
    });
  });
};

mongoose.model("Member", memberSchema);
