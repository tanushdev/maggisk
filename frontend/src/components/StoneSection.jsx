import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';

const StoneSection = () => {
  const [stones, setStones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStones = async () => {
      try {
        const { data } = await fetchProducts();
        // Extract unique stone types
        const uniqueStones = [...new Set(data.map(p => p.stoneType))].map(stone => {
            const productWithStone = data.find(p => p.stoneType === stone);
            return {
                name: stone,
                image: productWithStone?.images[0],
                slug: stone.toLowerCase().replace(/ /g, '-')
            };
        });
        setStones(uniqueStones.slice(0, 6)); // Show top 6
      } catch (error) {
        console.error('Error fetching stones:', error);
      } finally {
        setLoading(false);
      }
    };
    getStones();
  }, []);

  if (loading || stones.length === 0) return null;

  return (
    <section className="py-24 bg-[#fffbf6]">
      <div className="container mx-auto px-4 text-center">
        <span className="text-[#a66a4a] text-sm uppercase tracking-[0.4em] font-medium mb-4 block">Soul Alignment</span>
        <h2 className="text-4xl md:text-6xl font-serif text-gray-900 mb-16 italic">Shop by Stone</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-10">
          {stones.map((stone, i) => (
            <Link key={i} to={`/stone/${stone.slug}`} className="group relative">
               <div className="aspect-square rounded-full overflow-hidden border border-gray-100 mb-6 bg-white transition-transform duration-500 group-hover:scale-105">
                  <img src={stone.image} alt={stone.name} loading="lazy" className="w-full h-full object-cover" />
               </div>
               <h3 className="text-xs md:text-sm uppercase tracking-widest font-bold text-gray-900 group-hover:text-[#a66a4a] transition-colors">{stone.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoneSection;
