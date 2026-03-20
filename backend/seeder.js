const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Category = require('./models/Category');
const Coupon = require('./models/Coupon');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const categoriesList = [
  "Anklet", "Bracelet", "Bottle", "Crystal Towers", "Crystal Balls", "Fossils",
  "Geode/Caves", "Gemstone Trees", "Gift Box", "Ganesh Idol", "Hearts", "Jap Mala",
  "Keychains", "Lingam", "Miner Miniature", "Pyramids", "Pendant", "Pyrite Frames",
  "Rudraksha", "Rough Natural crystals", "Raw Crystal Chips", "Rings", "Selenite",
  "Tumbled Stones", "Wish/Glass Dome Tree", "Zibu Coin"
];

const users = [
  {
    name: 'Admin Guardian',
    email: 'admin@maggikstones.com',
    password: 'Admin@123',
    isAdmin: true,
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();

    // Create Categories
    const categoryDocs = categoriesList.map(name => ({
      name,
      slug: name.toLowerCase().replace(/[\s\/]/g, '-'),
      headerSection: 'Category'
    }));
    const createdCategories = await Category.insertMany(categoryDocs);

    // Find specific categories for seeding products
    const braceletCat = createdCategories.find(c => c.name === 'Bracelet');
    const towerCat = createdCategories.find(c => c.name === 'Crystal Towers');
    const geodeCat = createdCategories.find(c => c.name === 'Geode/Caves');

    const products = [
      {
        name: 'Deep Amethyst Crystal Tower',
        slug: 'deep-amethyst-crystal-tower',
        description: 'A high-vibration Amethyst tower for spiritual clarity and home protection.',
        price: 1250,
        countInStock: 8,
        categories: [towerCat._id],
        images: ['https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?auto=format&fit=crop&q=80&w=800'],
        stoneType: 'Amethyst',
        headerSection: 'Stone',
        isFeatured: true
      },
      {
        name: 'Rose Quartz Infinite Bracelet',
        slug: 'rose-quartz-infinite-bracelet',
        description: 'Premium Rose Quartz beads on an elastic cord. The ultimate stone of love.',
        price: 450,
        countInStock: 20,
        categories: [braceletCat._id],
        images: ['https://images.unsplash.com/photo-1611085583191-a3b13372c541?auto=format&fit=crop&q=80&w=800'],
        stoneType: 'Rose Quartz',
        headerSection: 'Category',
        isFeatured: true
      },
      {
        name: 'Natural Citrine Geode Cluster',
        slug: 'natural-citrine-geode-cluster',
        description: 'Radiant Citrine cluster to attract wealth and abundance into your office or home.',
        price: 2400,
        countInStock: 5,
        categories: [geodeCat._id],
        images: ['https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?auto=format&fit=crop&q=80&w=800'],
        stoneType: 'Citrine',
        headerSection: 'Home Decor',
        isFeatured: true
      }
    ];

    await Product.insertMany(products);
    
    for (const u of users) {
      const user = new User(u);
      await user.save();
    }

    // Seed initial coupons
    await Coupon.create([
      { code: 'SAVE10', discount: 10, discountType: 'percentage', expiry: new Date('2026-12-31'), usageLimit: 100 },
      { code: 'WELCOME50', discount: 50, discountType: 'flat', expiry: new Date('2026-12-31'), usageLimit: 50 }
    ]);

    console.log('Data Categorized Properly & Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
