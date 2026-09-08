import mongoose from 'mongoose';

// In-memory data store fallback if MongoDB server is unavailable
class InMemoryDatabase {
  constructor() {
    this.users = new Map();
    this.listings = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.wishlists = new Map();
    this.isInMemory = true;
  }

  get isConnectedToMongo() {
    return !this.isInMemory && mongoose.connection.readyState === 1;
  }

  async initSeedData() {
    if (this.listings.size > 0) return;

    const demoPasswordHash = '$2a$10$wT5gC...dummyhash'; // hashed 'password123'

    // Seed Demo Users
    const adminUser = { 
      _id: 'user_admin_1',
      name: 'Campus Admin',
      email: 'admin@stanford.edu',
      passwordHash: demoPasswordHash,
      college: 'Stanford University',
      hostel: 'Admin Quad',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      createdAt: new Date()
    };

    const studentUser1 = {
      _id: 'user_student_1',
      name: 'Alex Rivera',
      email: 'arivera@stanford.edu',
      passwordHash: demoPasswordHash,
      college: 'Stanford University',
      hostel: 'Wilbur Hall, Rm 304',
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      createdAt: new Date()
    };

    const studentUser2 = {
      _id: 'user_student_2',
      name: 'Sarah Chen',
      email: 'schen@mit.edu',
      passwordHash: demoPasswordHash,
      college: 'MIT',
      hostel: 'MacGregor House, Rm 112',
      role: 'student',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      isVerified: true,
      createdAt: new Date()
    };

    this.users.set(adminUser._id, adminUser);
    this.users.set(studentUser1._id, studentUser1);
    this.users.set(studentUser2._id, studentUser2);

    // Seed Initial Campus Marketplace Listings
    const sampleListings = [
      {
        _id: 'list_101',
        title: 'Introduction to Algorithms (CLRS 4th Ed) - Mint Condition',
        description: 'Hardcover 4th edition. No highlighter marks or bent pages. Essential for CS106B / CS161. Saved my grade, now passing it forward!',
        price: 45,
        originalPrice: 110,
        category: 'Books & Notes',
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
        sellerId: studentUser1._id,
        sellerName: studentUser1.name,
        sellerCollege: studentUser1.college,
        sellerHostel: studentUser1.hostel,
        status: 'active',
        aiGenerated: { descriptionByAI: true, suggestedPrice: 48 },
        moderationScore: 0.02,
        location: 'Wilbur Hall / Science Quad',
        createdAt: new Date(Date.now() - 3600000 * 24 * 2)
      },
      {
        _id: 'list_102',
        title: 'Dell UltraSharp 27" 4K USB-C Monitor for Coding/Study',
        description: 'Includes power cable and USB-C display cord. Perfect dorm setup dual monitor. Built-in USB hub charging capability.',
        price: 180,
        originalPrice: 350,
        category: 'Electronics',
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'],
        sellerId: studentUser2._id,
        sellerName: studentUser2.name,
        sellerCollege: studentUser2.college,
        sellerHostel: studentUser2.hostel,
        status: 'active',
        aiGenerated: { descriptionByAI: false, suggestedPrice: 195 },
        moderationScore: 0.01,
        location: 'MacGregor House / Student Union',
        createdAt: new Date(Date.now() - 3600000 * 12)
      },
      {
        _id: 'list_103',
        title: 'Ergonomic Mesh Swivel Desk Chair',
        description: 'High back lumbar support, adjustable height and armrests. Fits easily in standard dorm rooms. Super comfortable for long study sessions.',
        price: 35,
        originalPrice: 95,
        category: 'Furniture',
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80'],
        sellerId: studentUser1._id,
        sellerName: studentUser1.name,
        sellerCollege: studentUser1.college,
        sellerHostel: studentUser1.hostel,
        status: 'active',
        aiGenerated: { descriptionByAI: true, suggestedPrice: 38 },
        moderationScore: 0.0,
        location: 'Wilbur Hall Lobby',
        createdAt: new Date(Date.now() - 3600000 * 5)
      },
      {
        _id: 'list_104',
        title: 'Instant Pot 6-in-1 Mini Pressure Cooker & Rice Steamer',
        description: '3-Quart size ideal for hostel room cooking. Works great for quick rice, soups, and oatmeal. Cleaned thoroughly and tested.',
        price: 25,
        originalPrice: 60,
        category: 'Hostel Essentials',
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=800&q=80'],
        sellerId: studentUser2._id,
        sellerName: studentUser2.name,
        sellerCollege: studentUser2.college,
        sellerHostel: studentUser2.hostel,
        status: 'active',
        aiGenerated: { descriptionByAI: true, suggestedPrice: 28 },
        moderationScore: 0.0,
        location: 'Student Dining Center',
        createdAt: new Date(Date.now() - 3600000 * 36)
      },
      {
        _id: 'list_105',
        title: 'Organic Chemistry Lab Coat (Size M) + Safety Goggles',
        description: 'Required standard white lab coat for Chem 31/33 labs. Washed and sanitized. Includes anti-scratch UV splash goggles.',
        price: 15,
        originalPrice: 38,
        category: 'Lab & Course Gear',
        condition: 'Good',
        images: ['https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80'],
        sellerId: studentUser1._id,
        sellerName: studentUser1.name,
        sellerCollege: studentUser1.college,
        sellerHostel: studentUser1.hostel,
        status: 'active',
        aiGenerated: { descriptionByAI: false, suggestedPrice: 18 },
        moderationScore: 0.01,
        location: 'Science Library Courtyard',
        createdAt: new Date(Date.now() - 3600000 * 8)
      },
      {
        _id: 'list_106',
        title: 'Looking for Roommate: 2BHK Apartment near West Campus (Spring Semester)',
        description: 'Spacious private bedroom with private bath available. Rent is $750/mo including high-speed fiber internet and utilities. Quiet CS grad student roommate.',
        price: 750,
        originalPrice: 750,
        category: 'Roommate Finder',
        condition: 'Like New',
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
        sellerId: studentUser2._id,
        sellerName: studentUser2.name,
        sellerCollege: studentUser2.college,
        sellerHostel: studentUser2.hostel,
        status: 'active',
        aiGenerated: { descriptionByAI: true, suggestedPrice: 750 },
        moderationScore: 0.0,
        location: 'West Campus / College Ave',
        createdAt: new Date(Date.now() - 3600000 * 48)
      }
    ];

    sampleListings.forEach((item) => this.listings.set(item._id, item));

    // Seed Sample Conversation
    const conv1 = {
      _id: 'conv_1',
      participants: [studentUser1._id, studentUser2._id],
      listingId: 'list_101',
      listingTitle: 'Introduction to Algorithms (CLRS 4th Ed)',
      lastMessageAt: new Date()
    };
    this.conversations.set(conv1._id, conv1);

    const msg1 = {
      _id: 'msg_1',
      conversationId: conv1._id,
      senderId: studentUser2._id,
      senderName: studentUser2.name,
      text: 'Hi Alex! Is the CLRS Algorithms book still available for pickup at Wilbur Hall?',
      createdAt: new Date(Date.now() - 3600000 * 2)
    };
    const msg2 = {
      _id: 'msg_2',
      conversationId: conv1._id,
      senderId: studentUser1._id,
      senderName: studentUser1.name,
      text: 'Hey Sarah! Yes, absolutely. I can meet you outside the Wilbur dining hall around 4 PM today if that works for you.',
      createdAt: new Date(Date.now() - 3600000 * 1)
    };

    this.messages.set(msg1._id, msg1);
    this.messages.set(msg2._id, msg2);
  }
}

export const inMemoryDb = new InMemoryDatabase();

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/campusexchange';
    mongoose.set('strictQuery', false);
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`[Database] MongoDB Connected successfully: ${mongoose.connection.host}`);
    inMemoryDb.isInMemory = false;
  } catch (error) {
    console.warn(`[Database] MongoDB connection attempt failed (${error.message}).`);
    console.log('[Database] Switching to High-Performance In-Memory Data Store fallback.');
    await inMemoryDb.initSeedData();
    console.log('[Database] In-Memory Database initialized with sample campus listings & accounts.');
  }
};
