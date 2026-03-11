const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const generateSlug = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           
    .replace(/[^\w\-]+/g, '')       
    .replace(/\-\-+/g, '-')         
    .replace(/^-+/, '')             
    .replace(/-+$/, '');            
};

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/your_db_name');
    console.log('MongoDB Connected...');

    // IMPORTANT: This clears out the 21 products that already imported so you don't get duplicates!
    await Product.deleteMany({});
    console.log('Cleared existing products to prevent duplicates...');

    const productsToInsert = [];
    const categoriesSet = new Set();
    const csvData = [];

    fs.createReadStream('products.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (!row.Name) return;
        csvData.push(row);

        if (row.Categories) {
          const splitCats = row.Categories.split(',');
          splitCats.forEach((c) => {
            const parts = c.split('>'); 
            parts.forEach((p) => {
              const cleanCat = p.trim();
              if (cleanCat) categoriesSet.add(cleanCat);
            });
          });
        }
      })
      .on('end', async () => {
        console.log('CSV file successfully processed.');

        const categoryMap = {}; 
        for (const catName of categoriesSet) {
          let category = await Category.findOne({ name: catName });
          if (!category) {
            category = await Category.create({
              name: catName,
              slug: generateSlug(catName),
            });
          }
          categoryMap[catName] = category._id;
        }
        console.log(`Processed ${categoriesSet.size} unique categories.`);

        let rowCounter = 0; // Added a counter

        for (const row of csvData) {
          rowCounter++; // Increment counter for every row
          
          const productCategoryIds = [];
          if (row.Categories) {
            const splitCats = row.Categories.split(',');
            splitCats.forEach((c) => {
              const parts = c.split('>');
              parts.forEach((p) => {
                const cleanCat = p.trim();
                if (cleanCat && categoryMap[cleanCat]) {
                  if (!productCategoryIds.includes(categoryMap[cleanCat])) {
                     productCategoryIds.push(categoryMap[cleanCat]);
                  }
                }
              });
            });
          }

          const images = row.Images ? row.Images.split(',').map(img => img.trim()) : [];
          const tags = row.Tags ? row.Tags.split(',').map(tag => tag.trim()) : [];

          const attributes = [];
          if (row['Attribute 1 name'] && row['Attribute 1 value(s)']) {
            attributes.push({
              name: row['Attribute 1 name'].trim(),
              values: row['Attribute 1 value(s)'].split(',').map(v => v.trim())
            });
          }

          const regularPrice = parseFloat(row['Regular price']) || 0;
          const salePrice = parseFloat(row['Sale price']) || 0;
          
          let stockCount = parseInt(row['Stock']) || 0;
          if (isNaN(stockCount) && row['In stock?'] === '1') stockCount = 10; 

          productsToInsert.push({
            name: row.Name,
            // GUARANTEED UNIQUE SLUG: Name + Row Number + Random Number
            slug: `${generateSlug(row.Name)}-${rowCounter}-${Math.floor(Math.random() * 10000)}`, 
            sku: row.SKU || '',
            type: row.Type || 'simple',
            description: row.Description || 'No description provided', 
            shortDescription: row['Short description'] || '',
            price: regularPrice || salePrice || 0, 
            salePrice: salePrice,
            categories: productCategoryIds,
            tags: tags,
            images: images,
            countInStock: stockCount,
            weight: parseFloat(row['Weight (kg)']) || 0,
            dimensions: {
              length: parseFloat(row['Length (cm)']) || 0,
              width: parseFloat(row['Width (cm)']) || 0,
              height: parseFloat(row['Height (cm)']) || 0,
            },
            attributes: attributes,
            stoneType: 'Imported',
            headerSection: 'Category' 
          });
        }

        // Insert all products
        await Product.insertMany(productsToInsert);
        console.log(`Successfully imported ${productsToInsert.length} products!`);
        
        process.exit();
      });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();