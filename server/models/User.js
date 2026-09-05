import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  college: { type: String, default: 'Campus General' },
  hostel: { type: String, default: 'Dorm / Residence' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatarUrl: { type: String, default: '' },
  isVerified: { type: Boolean, default: true },
  refreshTokens: [
    {
      token: String,
      expiresAt: Date
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
