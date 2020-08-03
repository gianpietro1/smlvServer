const mongoose = require("mongoose");
const { Schema } = mongoose;

const pushTokenSchema = new mongoose.Schema({
  pushToken: {
    type: String,
    required: true,
  },
  _member: { type: Schema.Types.ObjectId, ref: "Member" },
});

mongoose.model("PushToken", pushTokenSchema);
