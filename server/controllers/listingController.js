import { Listing } from '../models/Listing.js';
import { inMemoryDb } from '../config/db.js';
import { moderateContent } from '../services/llmService.js';

// 1. GET LISTINGS (Search, Filter, Category, Price, Pagination)
export const getListings = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, condition, status = 'active', page = 1, limit = 20 } = req.query;

    let items = [];
    if (inMemoryDb.isConnectedToMongo) {
      const query = { status };
      if (category && category !== 'All') query.category = category;
      if (condition && condition !== 'All') query.condition = condition;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      items = await Listing.find(query).sort({ createdAt: -1 }).limit(Number(limit));
    } else {
      items = Array.from(inMemoryDb.listings.values());

      // Apply Filters
      if (status) items = items.filter(i => i.status === status);
      if (category && category !== 'All') items = items.filter(i => i.category === category);
      if (condition && condition !== 'All') items = items.filter(i => i.condition === condition);
      if (minPrice) items = items.filter(i => i.price >= Number(minPrice));
      if (maxPrice) items = items.filter(i => i.price <= Number(maxPrice));
      if (search) {
        const s = search.toLowerCase();
        items = items.filter(i => 
          i.title.toLowerCase().includes(s) || 
          i.description.toLowerCase().includes(s) ||
          i.location.toLowerCase().includes(s)
        );
      }

      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({
      listings: items,
      total: items.length,
      page: Number(page)
    });
  } catch (error) {
    console.error('Fetch listings error:', error);
    return res.status(500).json({ message: 'Failed to retrieve listings.' });
  }
};

// 2. GET LISTING BY ID
export const getListingById = async (req, res) => {
  try {
    let item = null;
    if (inMemoryDb.isConnectedToMongo) {
      item = await Listing.findById(req.params.id);
    } else {
      item = inMemoryDb.listings.get(req.params.id);
    }

    if (!item) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch listing.' });
  }
};

// 3. CREATE NEW LISTING
export const createListing = async (req, res) => {
  try {
    const { title, description, price, originalPrice, category, condition, images, location, aiGenerated } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: 'Title, description, and price are required.' });
    }

    // Run Automated AI Moderation
    const moderationResult = await moderateContent({ title, description });
    const isFlagged = moderationResult.isFlagged;
    const initialStatus = isFlagged ? 'flagged' : 'active';

    const listingData = {
      title,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.5,
      category: category || 'Other',
      condition: condition || 'Good',
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'],
      sellerId: req.user.userId,
      sellerName: req.user.name,
      sellerCollege: req.user.college,
      sellerHostel: req.user.hostel || 'Main Campus',
      status: initialStatus,
      aiGenerated: aiGenerated || { descriptionByAI: false, suggestedPrice: Number(price) },
      moderationScore: moderationResult.moderationScore || 0,
      location: location || 'Campus Main Square',
      createdAt: new Date()
    };

    let newListing;
    if (inMemoryDb.isConnectedToMongo) {
      newListing = await Listing.create(listingData);
    } else {
      newListing = { _id: 'list_' + Date.now(), ...listingData };
      inMemoryDb.listings.set(newListing._id, newListing);
    }

    if (isFlagged) {
      return res.status(201).json({
        message: 'Listing submitted! It has been temporarily held for admin review due to policy moderation guidelines.',
        listing: newListing,
        flaggedReason: moderationResult.reason
      });
    }

    return res.status(201).json({
      message: 'Listing published successfully to your campus marketplace!',
      listing: newListing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    return res.status(500).json({ message: 'Failed to create listing.' });
  }
};

// 4. UPDATE LISTING (Owner only or Admin)
export const updateListing = async (req, res) => {
  try {
    let item = null;
    if (inMemoryDb.isConnectedToMongo) {
      item = await Listing.findById(req.params.id);
    } else {
      item = inMemoryDb.listings.get(req.params.id);
    }

    if (!item) return res.status(404).json({ message: 'Listing not found.' });

    if (item.sellerId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. You can only edit your own listings.' });
    }

    const { title, description, price, category, condition, status, images, location } = req.body;
    const updated = {
      ...item,
      title: title ?? item.title,
      description: description ?? item.description,
      price: price !== undefined ? Number(price) : item.price,
      category: category ?? item.category,
      condition: condition ?? item.condition,
      status: status ?? item.status,
      images: images ?? item.images,
      location: location ?? item.location
    };

    if (inMemoryDb.isConnectedToMongo) {
      await Listing.findByIdAndUpdate(req.params.id, updated);
    } else {
      inMemoryDb.listings.set(req.params.id, updated);
    }

    return res.json({ message: 'Listing updated successfully.', listing: updated });
  } catch (error) {
    return res.status(500).json({ message: 'Update failed.' });
  }
};

// 5. DELETE LISTING (Owner or Admin)
export const deleteListing = async (req, res) => {
  try {
    let item = null;
    if (inMemoryDb.isConnectedToMongo) {
      item = await Listing.findById(req.params.id);
    } else {
      item = inMemoryDb.listings.get(req.params.id);
    }

    if (!item) return res.status(404).json({ message: 'Listing not found.' });

    if (item.sellerId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized. Cannot delete another user listing.' });
    }

    if (inMemoryDb.isConnectedToMongo) {
      await Listing.findByIdAndDelete(req.params.id);
    } else {
      inMemoryDb.listings.delete(req.params.id);
    }

    return res.json({ message: 'Listing removed.' });
  } catch (error) {
    return res.status(500).json({ message: 'Deletion failed.' });
  }
};
