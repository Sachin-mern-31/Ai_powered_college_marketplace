import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { 
    type: String, 
    enum: ['Books & Notes', 'Electronics', 'Furniture', 'Hostel Essentials', 'Lab & Course Gear', 'Roommate Finder', 'Other'],
    default: 'Other' 
  },
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair'], default: 'Good' },
  images: [{ type: String }],
  sellerId: { type: String, required: true },
  sellerName: { type: String },
  sellerCollege: { type: String },
  sellerHostel: { type: String },
  status: { type: String, enum: ['active', 'sold', 'flagged', 'removed'], default: 'active' },
  aiGenerated: {
    descriptionByAI: { type: Boolean, default: false },
    suggestedPrice: { type: Number }
  },
  moderationScore: { type: Number, default: 0.0 },
  location: { type: String, default: 'Campus Main' },
  createdAt: { type: Date, default: Date.now }
});

export const Listing = mongoose.models.Listing || mongoose.model('Listing', listingSchema);
