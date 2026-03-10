const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const csv = require("csv-parser");
const slugify = require("slugify");

const Product = require("./models/Product");
const connectDB = require("./config/db");

dotenv.config();

const CSV_FILE_PATH = path.join(__dirname, "../wc-product-export-10-3-2026-1773121302631.csv");

/**
 * Clean HTML and Shortcodes from description
 */
const cleanContent = (str) => {
  if (!str) return "No description available";

  return str
    .replace(/\[.*?\]/g, "") // Remove shortcodes
    .replace(/<[^>]*>?/gm, "") // Remove HTML tags
    .replace(/\\r\\n/g, "\n")
    .replace(/\\'/g, "'")
    .trim();
};

const importData = async () => {
  await connectDB();

  const results = [];

  console.log("🚀 Starting CSV Parsing...");

  // Defining the lists exactly as shown in the navigation menu images
  const stonesList = [
    "Amethyst", "Clear Quartz", "Pyrite", "Lapis Lazuli", "Tiger Eye", 
    "Black Tourmaline", "Rose Quartz", "Citrine", "Carnelian", 
    "Malachite", "Labradorite", "Aura Quartz", "Green Jade", 
    "Mahogany", "Red jasper", "Hematite", "Smoky Quartz", "Selenite"
  ];

  const homeDecorList = [
    "Crystal Balls", "Crystal Towers", "Fossils", "Gemstone Trees", 
    "Geode/ caves", "Hearts", "Miner miniature", "Pyramids", 
    "Pyrite Frames", "Wish/Glass Dome Tree"
  ];

  const categoryList = [
    "Anklet", "Bracelet", "Bottle", "Crystal Towers", "Crystal Balls", 
    "Fossils", "Geode/Caves", "Gemstone Trees", "Gift Box", "Ganesh Idol", 
    "Hearts", "Jap Mala", "Keychains", "Lingam", "Miner Miniature", 
    "Pyramids", "Pendant", "Pyrite Frames", "Rudraksha", "Rough Natural crystals", 
    "Raw Crystal Chips", "Rings", "Selenite", "Tumbled Stones", 
    "Wish/Glass Dome Tree", "Zibu Coin"
  ];

  const parser = fs.createReadStream(CSV_FILE_PATH).pipe(csv());

  for await (const data of parser) {
    if (data.Published === "1" && (data.Type === "simple" || data.Type === "variable")) {
      
      // Handle images: split by comma, and use raw online URLs
      let imageList = [];
      if (data.Images) {
        imageList = data.Images.split(",")
          .map(img => img.trim())
          .filter(img => img.length > 0)
          .map(img => img.split('?')[0]); 
      }
      
      if (imageList.length === 0) {
        imageList = ["https://via.placeholder.com/800"];
      }

      // Parsing categories
      const rawCategories = data.Categories ? data.Categories.split(",").map(c => c.trim()) : [];
      let finalCategory = "Miscellaneous";
      let finalStoneType = "Stone";
      let headerSection = "Category";

      // Flatten hierarchal categories to check for matches
      const flatCats = rawCategories.map(c => c.split(">").pop().trim());

      // Priority 1: Check for Stones (Image 2)
      const matchedStone = flatCats.find(c => stonesList.includes(c));
      
      // Priority 2: Check for Home Decor (Image 3)
      const matchedDecor = flatCats.find(c => homeDecorList.includes(c));

      // Priority 3: Check for General Category (Image 1)
      const matchedCategory = flatCats.find(c => categoryList.includes(c));

      if (matchedStone) {
        headerSection = "Stone";
        finalStoneType = matchedStone;
        finalCategory = matchedStone;
      } else if (matchedDecor) {
        headerSection = "Home Decor";
        finalCategory = matchedDecor;
      } else if (matchedCategory) {
        headerSection = "Category";
        finalCategory = matchedCategory;
      } else if (flatCats.length > 0) {
        // Fallback to first category found
        finalCategory = flatCats[0];
        headerSection = "Category"; 
      }

      const product = {
        name: data.Name,
        slug: slugify(data.Name, { lower: true }) + '-' + Math.floor(Math.random() * 10000),
        description: cleanContent(data.Description),
        shortDescription: cleanContent(data["Short description"]),
        price: parseFloat(data["Regular price"]) || parseFloat(data["Sale price"]) || 0,
        discountPrice: parseFloat(data["Sale price"]) || 0,
        countInStock: parseInt(data.Stock) || 0,
        category: finalCategory,
        stoneType: finalStoneType,
        headerSection: headerSection,
        images: imageList.length > 0 ? imageList : ["https://via.placeholder.com/800"],
        metaTitle: data.Name,
        metaDescription: cleanContent(data["Short description"]).substring(0, 160),
        rating: 0,
        numReviews: 0,
        isFeatured: data["Is featured?"] === "1",
      };

      results.push(product);
    }
  }

  console.log(`📦 Parsed ${results.length} valid products.`);

  if (results.length === 0) {
    console.log("⚠️ No products found in CSV.");
    process.exit();
  }

  try {
    console.log("🧹 REMOVING ALL EXISTING PRODUCTS...");
    await Product.deleteMany({}); // CLEAR EVERYTHING

    console.log("💾 Inserting into MongoDB...");
    const batchSize = 100;
    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      await Product.insertMany(batch, { ordered: false }).catch(err => {
        if (!err.message.includes('E11000')) console.error("Batch Error:", err.message);
      });
      console.log(`Progress: ${Math.min(i + batchSize, results.length)}/${results.length}`);
    }

    console.log("✅ CSV IMPORT SUCCESSFUL WITH NAVIGATION MAPPING!");
  } catch (error) {
    console.error("❌ Import Error:", error.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

importData();
