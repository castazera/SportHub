import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'User' });

export default mongoose.model('User', userSchema);
