import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { fetchProducts } from '../services/api';
import { ArrowRight } from 'lucide-react';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        
        // Robust data handling to prevent slicing non-array objects
        let productList = [];
        if (Array.isArray(data)) {
          productList = data;
        } else if (data && data.products && Array.isArray(data.products)) {
          productList = data.products;
        }
        
        // Get up to 4 items for the featured display
        setProducts(productList.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <section className="bg-white py-32 font-arial border-t border-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-xl">
            <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.4em] mb-4">Curated Collection</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter leading-none">Latest Artifacts</h2>
          </div>
          <Link 
            to="/category/all" 
            className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all border-b border-transparent hover:border-gray-900 pb-2 group"
          >
            Explore World Of Stones <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-gray-100 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8 xl:gap-12">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id || product.slug}
                  _id={product._id}
                  name={product.title}
                  slug={product.slug}
                  price={product.price}
                  discountPrice={product.sale_price}
                  image={product.images?.[0]}
                  hoverImage={product.images?.[1]}
                  category={product.categories?.[0]}
                  countInStock={product.countInStock}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] font-bold italic">
                  Treasures are currently being manifested
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-24 text-center lg:hidden">
           <Link 
            to="/category/all" 
            className="inline-block bg-gray-900 text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-theme-rust transition-all shadow-xl shadow-gray-200"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;