const fs = require("fs");
const path = require("path");
const readline = require("readline");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const csv = require("csv-parser");
const slugify = require("slugify");

const Product = require("./models/Product");
const connectDB = require("./config/db");

dotenv.config();

const SQL_FILE_PATH = path.join(__dirname, "../u615986106_G6HdH (1).sql");
const CSV_FILE_PATH = path.join(__dirname, "../wc-product-export-10-3-2026-1773121302631.csv");

/**
 * Remove HTML & WordPress shortcodes
 */
const cleanContent = (str) => {
  if (!str) return "No description available";
  return str
    .replace(/\[.*?\]/g, "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/\\r\\n/g, "\n")
    .replace(/\\'/g, "'")
    .trim();
};

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

async function runImport() {
  await connectDB();

  const sqlMetaMap = new Map(); // Map<postId, { price, regularPrice, salePrice, stock }>
  const sqlCategoryMap = new Map(); // Map<postId, Set<categoryName>>

  if (fs.existsSync(SQL_FILE_PATH)) {
    console.log("🛠️ Step 1: Parsing SQL for Metadata and Categories...");
    const fileStream = fs.createReadStream(SQL_FILE_PATH);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let currentTable = null;
    const terms = new Map(); // term_id -> name
    const termTaxonomy = new Map(); // tt_id -> term_id
    const relationships = []; // { object_id, tt_id }

    for await (const line of rl) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (trimmedLine.includes("INSERT INTO `wpks_terms`")) currentTable = "terms";
      else if (trimmedLine.includes("INSERT INTO `wpks_term_taxonomy`")) currentTable = "term_taxonomy";
      else if (trimmedLine.includes("INSERT INTO `wpks_term_relationships`")) currentTable = "relationships";
      else if (trimmedLine.includes("INSERT INTO `wpks_postmeta`")) currentTable = "postmeta";
      else if (trimmedLine.startsWith("INSERT INTO")) currentTable = null;

      if (!currentTable) continue;

      let dataPart = trimmedLine;
      if (dataPart.includes("VALUES")) dataPart = dataPart.split(/VALUES/i)[1];
      const blocks = dataPart.split(/\),\s*\(/);

      blocks.forEach(block => {
        const cleanBlock = block.replace(/^\s*\(/, "").replace(/\);?$/, "").trim();
        if (!cleanBlock) return;

        const ids = cleanBlock.match(/^(\d+),\s*(\d+)/);
        const fields = cleanBlock.match(/'((?:\\'|[^'])*)'/g)?.map(f => f.slice(1, -1).replace(/\\'/g, "'")) || [];

        if (currentTable === "terms" && ids) {
          const termId = ids[1];
          const name = fields[0];
          terms.set(termId, name);
        }

        if (currentTable === "term_taxonomy" && ids) {
          const ttId = ids[1];
          const termId = ids[2];
          termTaxonomy.set(ttId, termId);
        }

        if (currentTable === "relationships" && ids) {
          const objectId = ids[1];
          const ttId = ids[2];
          relationships.push({ objectId, ttId });
        }

        if (currentTable === "postmeta" && ids) {
          const postId = ids[2];
          const key = fields[0];
          const val = fields[1];
          if (!sqlMetaMap.has(postId)) sqlMetaMap.set(postId, {});
          const meta = sqlMetaMap.get(postId);
          if (key === "_price") meta.price = parseFloat(val);
          if (key === "_regular_price") meta.regularPrice = parseFloat(val);
          if (key === "_sale_price") meta.salePrice = parseFloat(val);
          if (key === "_stock") meta.stock = parseInt(val);
        }
      });
    }

    // Process relationships to build category map
    relationships.forEach(rel => {
      const termId = termTaxonomy.get(rel.ttId);
      const name = terms.get(termId);
      if (name) {
        if (!sqlCategoryMap.has(rel.objectId)) sqlCategoryMap.set(rel.objectId, new Set());
        sqlCategoryMap.get(rel.objectId).add(name);
      }
    });

    console.log(`✅ Loaded meta for ${sqlMetaMap.size} posts.`);
    console.log(`✅ Loaded categories for ${sqlCategoryMap.size} posts.`);
  }

  console.log("🛠️ Step 2: Parsing CSV and Implementing Navigation Logic...");
  const finalProducts = [];
  const csvParser = fs.createReadStream(CSV_FILE_PATH).pipe(csv());

  for await (const row of csvParser) {
    if (row.Published !== "1") continue;
    if (row.Type !== "simple" && row.Type !== "variable") continue;

    const id = row.ID;
    const meta = sqlMetaMap.get(id) || {};
    const sqlCategories = sqlCategoryMap.get(id) || new Set();
    
    // Combine CSV categories with SQL ones
    const rowCats = row.Categories ? row.Categories.split(",").map(c => c.split(">").pop().trim()) : [];
    const allCategories = new Set([...sqlCategories, ...rowCats]);

    let regularPrice = meta.regularPrice || meta.price || parseFloat(row["Regular price"]) || 0;
    let salePrice = meta.salePrice || parseFloat(row["Sale price"]) || 0;
    if (regularPrice === 0 && salePrice > 0) regularPrice = salePrice;

    let images = [];
    if (row.Images) images = row.Images.split(",").map(img => img.trim().split('?')[0]).filter(img => img.startsWith('http'));
    if (images.length === 0) images = ["https://via.placeholder.com/800"];

    // Categorization Logic with Priority
    let headerSection = "Category";
    let finalCategory = "Miscellaneous";
    let finalStoneType = "Stone";

    // Convert Set to Array for checking
    const catsArr = Array.from(allCategories);

    // 1. Check for Home Decor (Priority as per user request)
    const matchedDecor = catsArr.find(c => homeDecorList.includes(c) || c.toLowerCase().includes("decor"));
    
    // 2. Check for Stone
    const matchedStone = catsArr.find(c => stonesList.includes(c) || c.toLowerCase().includes("stones"));

    // 3. Check for Category
    const matchedCategory = catsArr.find(c => categoryList.includes(c));

    if (matchedDecor) {
      headerSection = "Home Decor";
      finalCategory = matchedDecor || "Home Decor";
    } else if (matchedStone) {
      headerSection = "Stone";
      finalStoneType = matchedStone || "Stone";
      finalCategory = matchedStone || "Stone";
    } else if (matchedCategory) {
      headerSection = "Category";
      finalCategory = matchedCategory;
    } else if (catsArr.length > 0) {
      finalCategory = catsArr[0];
    }

    finalProducts.push({
      name: row.Name,
      slug: slugify(row.Name, { lower: true }) + '-' + Math.floor(Math.random() * 10000),
      description: cleanContent(row.Description || ""),
      shortDescription: cleanContent(row["Short description"] || ""),
      price: regularPrice,
      discountPrice: salePrice > 0 && salePrice < regularPrice ? salePrice : 0,
      countInStock: meta.stock !== undefined ? meta.stock : (parseInt(row.Stock) || 0),
      category: finalCategory,
      stoneType: finalStoneType,
      headerSection: headerSection,
      images: images,
      metaTitle: row.Name,
      metaDescription: cleanContent(row["Short description"] || "").substring(0, 160),
      rating: 0,
      numReviews: 0,
      isFeatured: row["Is featured?"] === "1",
    });
  }

  console.log(`📦 Prepared ${finalProducts.length} products for import.`);

  try {
    console.log("🧹 CLEARING DATABASE...");
    await Product.deleteMany({});

    console.log("💾 Importing batch by batch...");
    const batchSize = 100;
    for (let i = 0; i < finalProducts.length; i += batchSize) {
      const batch = finalProducts.slice(i, i + batchSize);
      await Product.insertMany(batch, { ordered: false }).catch(err => {
        if (!err.message.includes('E11000')) console.error("Batch Error:", err.message);
      });
      console.log(`Progress: ${Math.min(i + batchSize, finalProducts.length)}/${finalProducts.length}`);
    }

    console.log("✨ COMBINED IMPORT SUCCESSFUL!");
  } catch (err) {
    console.error("❌ Fatal Error:", err.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
}

runImport();
