const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

const verifyAtlas = async () => {
    try {
        console.log(`Connecting to: ${process.env.MONGO_URI}`);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('--- Connected to Atlas Successfully ---');

        const total = await Product.countDocuments({});
        const sample = await Product.findOne({});

        console.log(`\n--- Atlas Verification ---`);
        console.log(`Total Products in Atlas: ${total}`);
        
        if (sample) {
            console.log('\n--- Sample Product Data ---');
            console.log(`Title: ${sample.title}`);
            console.log(`Slug : ${sample.slug}`);
            console.log(`Price: ₹${sample.price}`);
            
            // Check descriptions
            const hasShort = sample.short_description_html && sample.short_description_html.length > 20;
            const hasLong = sample.long_description_html && sample.long_description_html.length > 50;
            console.log(`Short Description: ${hasShort ? 'Present ✅' : 'Empty ❌'}`);
            console.log(`Long Description : ${hasLong ? 'Present ✅' : 'Empty ❌'}`);

            // Check if unwanted fields exist (should be undefined)
            console.log(`Unwanted Field (url)     : ${sample.url === undefined ? 'Removed ✅' : 'Still there ❌'}`);
            console.log(`Unwanted Field (stoneType): ${sample.stoneType === undefined ? 'Removed ✅' : 'Still there ❌'}`);
        } else {
            console.log('No products found in Atlas!');
        }

        process.exit();
    } catch (err) {
        console.error('Atlas connection failed during verification:', err.message);
        process.exit(1);
    }
};

verifyAtlas();
