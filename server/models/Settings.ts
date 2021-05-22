import { Schema, model } from "mongoose";

const SettingsSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  settings: {
    type: Object,
    required: true,
  },
});

const Settings = model("Settings", SettingsSchema);
export default Settings;
