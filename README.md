### 1. Prerequisites

* **Node.js**: v18+ recommended
* **MongoDB**: Local instance running or Atlas URI
* **Git**

### 2. Environment Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/xeedesgin
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 3. Installation

Install dependencies for both the frontend and backend.

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 4. Running the Application

Open two terminal windows/tabs.

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

---

### Files Required

Place these files in the root directory (one level above `backend`):

1. `wc-product-export-10-3-2026-1773121302631.csv` (Product List & Categories)
2. `u615986106_G6HdH (1).sql` (Source for accurate Prices & Stock)

### Running the Import

This script clears the existing database and performs a fresh merged import.

```bash
cd backend
node importCombinedData.js
```
