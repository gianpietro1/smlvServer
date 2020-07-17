const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  mainUrl: String,
  imageUrl: String,
  isActive: Boolean,
  _member: { type: Schema.Types.ObjectId, ref: "Member" },
});

mongoose.model("Project", projectSchema);
