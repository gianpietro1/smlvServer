const mongoose = require("mongoose");
const { Schema } = mongoose;

const causeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  mainUrl: String,
  imageUrl: String,
  published: Date,
  expires: Date,
  _member: { type: Schema.Types.ObjectId, ref: "Member" },
});

mongoose.model("Cause", causeSchema);
