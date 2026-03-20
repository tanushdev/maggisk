const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const syncProductSections = async (product) => {
  try {
    const categories = await Category.find({ name: { $in: product.categories } });
    
    const sections = new Set();
    categories.forEach(c => (c.displaySections || []).forEach(s => sections.add(s)));
    
    // Fallback: If no categories match, give it at least "Category"
    if (sections.size === 0) {
      sections.add('Shop By Category');
    }
    
    product.headerSection = Array.from(sections);
  } catch (err) {
    console.error('Section sync error:', err);
  }
};

const repairAtlas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Atlas for repair...');

        const products = await Product.find({});
        console.log(`Processing ${products.length} products...`);

        for (const product of products) {
            await syncProductSections(product);
            
            // Also restore stoneType if it looks like a stone (from its categories)
            const stones = ['Amethyst', 'Pyrite', 'Citrine', 'Quartz', 'Quartz', 'Tourmaline', 'Lapis', 'Tiger Eye', 'Jasper', 'Jade', 'Labradorite', 'Carnelian', 'Malachite', 'Rose Quartz'];
            const foundStones = product.categories.filter(c => stones.some(s => c.includes(s)));
            if (foundStones.length > 0) {
                product.stoneType = foundStones;
                if (!product.headerSection.includes('Shop By Stone')) {
                    product.headerSection.push('Shop By Stone');
                }
            }

            await product.save();
        }

        console.log('--- REPAIR COMPLETE ---');
        console.log('All products now have headerSection and stoneType restored in Atlas.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

repairAtlas();
