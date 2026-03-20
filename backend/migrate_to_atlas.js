const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Atlas URI from .env
const ATLAS_URI = 'mongodb+srv://db:db123@xeecluster.mnci11j.mongodb.net/maggisk?appName=XeeCluster';

const migrate = async () => {
    try {
        await mongoose.connect(ATLAS_URI);
        console.log('--- Connected to Atlas ---');

        const migrationPath = path.resolve(__dirname, 'migration_data.json');
        if (!fs.existsSync(migrationPath)) {
            throw new Error('migration_data.json not found!');
        }

        const data = JSON.parse(fs.readFileSync(migrationPath, 'utf8'));
        const products = data.products;

        console.log(`Preparing to migrate ${products.length} products to Atlas...`);

        // Get collection directly to avoid Mongoose schema restrictions
        const collection = mongoose.connection.db.collection('products');
        
        // Wipe Atlas products first to ensure clean state
        await collection.deleteMany({});
        console.log('Cleared existing Atlas products.');

        // Clean products data before insertion
        const cleanedProducts = products.map(p => {
            const { 
                url, // Remove
                headerSection, // Remove
                stoneType, // Remove
                __v, // Remove Mongoose version key
                ...rest 
            } = p;
            
            // Convert string _id back to ObjectId
            if (rest._id) {
                rest._id = new mongoose.Types.ObjectId(rest._id);
            }
            
            // Standardize types if needed
            rest.price = Number(rest.price) || 0;
            rest.sale_price = Number(rest.sale_price) || 0;
            rest.countInStock = Number(rest.countInStock) || 0;
            rest.isFeatured = Boolean(rest.isFeatured);
            
            return rest;
        });

        const result = await collection.insertMany(cleanedProducts);
        console.log(`Successfully migrated ${result.insertedCount} products to Atlas.`);

        process.exit();
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
