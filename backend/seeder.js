const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const products = [
  {
    name: 'Amethyst Healing Cluster',
    slug: 'amethyst-healing-cluster',
    description: 'A beautiful natural Amethyst cluster from Uruguay. Known for its calming energy and striking deep purple hue.',
    price: 85.00,
    category: 'Crystals',
    stoneType: 'Amethyst',
    images: ['https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?auto=format&fit=crop&q=80&w=800'],
    countInStock: 10,
    rating: 4.8,
    numReviews: 12,
    metaTitle: 'Natural Amethyst Healing Cluster | MaggiK Stones',
    metaDescription: 'Deep purple Amethyst cluster for meditation and home decor.'
  },
  {
    name: 'Rose Quartz Love Bracelet',
    slug: 'rose-quartz-love-bracelet',
    description: 'Handcrafted bracelet featuring genuine Rose Quartz beads. The stone of universal love.',
    price: 35.00,
    category: 'Bracelets',
    stoneType: 'Rose Quartz',
    images: ['https://images.unsplash.com/photo-1611085583191-a3b13372c541?auto=format&fit=crop&q=80&w=800'],
    countInStock: 25,
    rating: 4.5,
    numReviews: 8,
    metaTitle: 'Rose Quartz Bracelet - Universal Love | MaggiK Stones',
    metaDescription: 'Handmade rose quartz bracelet for attracting love and harmony.'
  },
  {
    name: 'Clear Quartz Point',
    slug: 'clear-quartz-point',
    description: 'High-clarity Clear Quartz point for amplification and clarity of mind.',
    price: 45.00,
    category: 'Crystals',
    stoneType: 'Clear Quartz',
    images: ['https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?auto=format&fit=crop&q=80&w=800'],
    countInStock: 15,
    rating: 5.0,
    numReviews: 5,
    metaTitle: 'Clear Quartz Point - Master Healer | MaggiK Stones',
    metaDescription: 'Master healer Clear Quartz point for energy amplification.'
  }
];

const users = [
  {
    name: 'Admin Guardian',
    email: 'admin@maggikstones.com',
    password: 'adminpassword123',
    isAdmin: true,
  },
  {
    name: 'Seeker Tanush',
    email: 'tanush@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);
    
    // Using a loop to ensure 'save' middleware is triggered for each user
    for (const u of users) {
      const user = new User(u);
      await user.save();
    }

    console.log('Data Imported!');

    process.exit();

  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
