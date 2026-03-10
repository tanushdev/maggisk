const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const slugify = require("slugify");

const Product = require("./models/Product");
const connectDB = require("./config/db");

dotenv.config();

const SQL_FILE_PATH = path.join(__dirname, "");

connectDB();

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

const parseSql = async () => {

  const productsMap = new Map();
  const attachmentsMap = new Map();

  if (!fs.existsSync(SQL_FILE_PATH)) {
    console.error("SQL file not found:", SQL_FILE_PATH);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(SQL_FILE_PATH);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  console.log("🚀 Parsing WooCommerce SQL dump...");

  let currentTable = null;

  for await (const line of rl) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Detect table context
    if (trimmedLine.includes("INSERT INTO `wpks_posts`")) {
      currentTable = "posts";
    } else if (trimmedLine.includes("INSERT INTO `wpks_postmeta`")) {
      currentTable = "postmeta";
    } else if (trimmedLine.startsWith("INSERT INTO")) {
      currentTable = null;
    }

    if (!currentTable) continue;

    /**
     * Parse the line as data blocks
     * Rows usually look like (1, 2, 'string'), (4, 5, 'string');
     */
    if (trimmedLine.startsWith("(")) {
      const blocks = trimmedLine.split(/\),\s*\(/);

      blocks.forEach((block) => {
        // Clean leading/trailing parentheses and semicolon, THEN trim
        const cleanBlock = block.replace(/^\(|\);?$/g, "").trim();

        // Match the ID and Post ID (first two numbers)
        const idMatches = cleanBlock.match(/^(\d+),\s*(\d+)/);
        if (!idMatches) return;

        const id = idMatches[1];
        const postId = idMatches[2];

        /**
         * Extract string values safely
         */
        const fields =
          cleanBlock.match(/'((?:\\'|[^'])*)'/g)?.map((f) =>
            f.slice(1, -1).replace(/\\'/g, "'")
          ) || [];

        if (currentTable === "posts") {
          const postStatus = fields[5];
          const postType = fields[16];

          if (postType === 'product' && postStatus === 'publish') {
            const description = fields[2] || "";
            const title = fields[3] || "Unnamed Product";
            const slug = fields[9] || `product-${id}`;

            productsMap.set(id, {
              name: title,
              slug: slugify(slug || title, { lower: true }),
              description: cleanContent(description),
              shortDescription: "",
              price: 0,
              discountPrice: 0,
              category: "Imported",
              headerSection: "Category",
              stoneType: "Stone",
              images: [],
              thumbnailId: null,
              countInStock: 0,
              metaTitle: "",
              metaDescription: "",
              rating: 0,
              numReviews: 0,
            });
          }

          if (postType === 'attachment') {
            const guid = fields[15];
            if (guid && guid.includes('/uploads/')) {
              const uploadPath = guid.split("/uploads/")[1];
              attachmentsMap.set(id, uploadPath);
            }
          }
        }

        if (currentTable === "postmeta") {
          // fields array will be: [0: key, 1: value]
          const metaKey = fields[0];
          const metaValue = fields[1];

          if (productsMap.has(postId)) {
            const product = productsMap.get(postId);
            // WooCommerce often has _price, _regular_price, _sale_price
            if (metaKey === "_price" || metaKey === "_regular_price") {
              const val = parseFloat(metaValue);
              if (val > 0) product.price = val;
            }
            if (metaKey === "_sale_price") {
              const val = parseFloat(metaValue);
              if (val > 0) product.discountPrice = val;
            }
            if (metaKey === "_stock") {
              product.countInStock = parseInt(metaValue) || 0;
            }
            if (metaKey === "_thumbnail_id") {
              product.thumbnailId = metaValue;
            }
          }
        }
      });
    }
  }

  console.log("🔗 Linking images...");

  for (const [id, product] of productsMap) {

    if (product.thumbnailId && attachmentsMap.has(product.thumbnailId)) {

      const imagePath = attachmentsMap.get(product.thumbnailId);

      product.images = [`/wp-content/uploads/${imagePath}`];

    } else {

      product.images = ["/wp-content/uploads/placeholder.jpg"];
    }

    delete product.thumbnailId;
  }

  const products = Array.from(productsMap.values()).filter(
    (p) => p.name && p.name !== "Unnamed Product"
  );

  console.log(`📦 Products parsed: ${products.length}`);

  if (!products.length) {
    console.log("⚠️ No products found. Check table prefix and column mapping.");
    process.exit();
  }

  try {

    console.log("🧹 Removing previous imported products...");
    await Product.deleteMany({ category: "Imported" });

    console.log("💾 Importing into MongoDB...");

    const batchSize = 100;

    for (let i = 0; i < products.length; i += batchSize) {

      const batch = products.slice(i, i + batchSize);

      await Product.insertMany(batch, { ordered: false });

      console.log(`Imported ${Math.min(i + batchSize, products.length)} / ${products.length}`);
    }

    console.log("✅ WooCommerce products successfully imported!");

  } catch (err) {

    console.error("❌ MongoDB error:", err.message);

  } finally {

    mongoose.connection.close();
    process.exit();
  }
};

parseSql();
