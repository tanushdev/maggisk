import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from '../services/api';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        // Assuming the backend returns an array of products. 
        // We take the first 4 for the "Latest Products" section.
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6">Latest Products</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#a66a4a] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product._id || product.slug}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  discountPrice={product.discountPrice}
                  image={product.images && product.images[0]}
                  hoverImage={product.images && product.images[1]}
                  category={product.category}
                />

              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500 italic">
                Our latest treasures are arriving soon...
              </div>
            )}
          </div>
        )}

        <div className="mt-20 text-center">
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
