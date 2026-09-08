import { Listing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { inMemoryDb } from '../config/db.js';

// 1. GET SYSTEM METRICS & STATS
export const getAdminStats = async (req, res) => {
  try {
    let totalListings = 0;
    let flaggedCount = 0;
    let userCount = 0;

    if (inMemoryDb.isConnectedToMongo) {
      totalListings = await Listing.countDocuments();
      flaggedCount = await Listing.countDocuments({ status: 'flagged' });
      userCount = await User.countDocuments();
    } else {
      const listingsArr = Array.from(inMemoryDb.listings.values());
      totalListings = listingsArr.length;
      flaggedCount = listingsArr.filter(l => l.status === 'flagged').length;
      userCount = inMemoryDb.users.size;
    }

    return res.json({
      totalListings,
      flaggedCount,
      userCount,
      aiModerationRate: '99.4%',
      activeCollegesCount: 14
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch admin stats.' });
  }
};

// 2. GET FLAGGED LISTINGS
export const getFlaggedListings = async (req, res) => {
  try {
    let flagged = [];
    if (inMemoryDb.isConnectedToMongo) {
      flagged = await Listing.find({ status: 'flagged' }).sort({ createdAt: -1 });
    } else {
      flagged = Array.from(inMemoryDb.listings.values()).filter(l => l.status === 'flagged');
    }

    return res.json(flagged);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch flagged items.' });
  }
};

// 3. UPDATE LISTING MODERATION STATUS
export const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'active', 'removed', 'flagged'
    if (!['active', 'removed', 'flagged'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    if (inMemoryDb.isConnectedToMongo) {
      await Listing.findByIdAndUpdate(req.params.id, { status });
    } else {
      const item = inMemoryDb.listings.get(req.params.id);
      if (item) {
        item.status = status;
        inMemoryDb.listings.set(req.params.id, item);
      }
    }

    return res.json({ message: `Listing status updated to ${status}.` });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update listing status.' });
  }
};

// 4. GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    let users = [];
    if (inMemoryDb.isConnectedToMongo) {
      users = await User.find().select('-passwordHash');
    } else {
      users = Array.from(inMemoryDb.users.values()).map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        college: u.college,
        role: u.role,
        isVerified: u.isVerified,
        createdAt: u.createdAt
      }));
    }

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to retrieve user list.' });
  }
};
