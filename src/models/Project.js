const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  mainUrl: String,
  facebook: String,
  instagram: String,
  youtube: String,
  whatsapp: String,
  imageUrl: String,
  imageUrlMini: String,
  isActive: Boolean,
  projectType: {
    type: String,
    default: "Producto",
  },
  _member: { type: Schema.Types.ObjectId, ref: "Member" },
});

mongoose.model("Project", projectSchema);
