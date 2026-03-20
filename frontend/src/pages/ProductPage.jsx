import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, RefreshCw, Heart, Share2, Star } from 'lucide-react';
import { fetchProductBySlug, createProductReview } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const { userInfo } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');


  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await fetchProductBySlug(slug);
        setProduct(data);
        document.title = `${data.title} | MaggiK Stones`;
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    openCart();
  };


  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setReviewError('Please select a rating');
      return;
    }
    try {
      setReviewLoading(true);
      setReviewError('');
      await createProductReview(product._id, { rating, comment });
      alert('Review submitted successfully');
      setRating(0);
      setComment('');
      // refresh product
      const { data } = await fetchProductBySlug(slug);
      setProduct(data);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-cream">
        <div className="w-12 h-12 border-4 border-theme-rust border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-theme-cream px-4 text-center">
        <h2 className="text-4xl font-serif text-gray-900 mb-6 italic">The crystal you seek has moved...</h2>
        <Link to="/" className="text-theme-rust uppercase tracking-widest text-sm border-b border-theme-rust pb-1 font-medium">Return to collection</Link>
      </div>
    );
  }

  return (
    <div className="bg-theme-cream min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-8 pb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] text-gray-400 hover:text-theme-rust transition-colors uppercase font-bold mb-12">
          <ChevronLeft size={14} /> Back to Boutique
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 lg:items-start">
          {/* Product Gallery */}
          <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative aspect-square bg-white overflow-hidden rounded-sm group border border-gray-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={product.images[activeImage]}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button className="bg-white/80 backdrop-blur-md p-3 rounded-full text-gray-700 hover:bg-theme-rust hover:text-white transition-all shadow-sm">
                  <Heart size={20} />
                </button>
                <button className="bg-white/80 backdrop-blur-md p-3 rounded-full text-gray-700 hover:bg-theme-rust hover:text-white transition-all shadow-sm">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square overflow-hidden rounded-sm border-2 transition-all ${activeImage === idx ? 'border-theme-rust' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                   <img src={img} alt={`${product.title} thumbnail ${idx}`} loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col lg:col-span-7">
            <div className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-theme-rust font-bold">
                  {product.categories?.[0] || 'Collection'}
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">{product.headerSection}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 italic leading-tight">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-6 text-theme-rust">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < (product.rating || 0) ? "currentColor" : "none"} />)}
                <span className="text-[10px] text-gray-400 uppercase tracking-widest ml-2">({product.numReviews || 0} Verified Reviews)</span>
              </div>
              <div className="flex items-baseline gap-4 mb-8">
                {product.sale_price > 0 && product.sale_price < product.price ? (
                  <>
                    <span className="text-3xl font-sans font-semibold text-gray-900">₹{product.sale_price}</span>
                    <span className="text-xl text-gray-400 line-through font-light">₹{product.price}</span>
                  </>
                ) : (
                  <span className="text-3xl font-sans font-semibold text-gray-900">₹{product.price}</span>
                )}
                
                {product.countInStock > 0 ? (
                  <span className="ml-auto text-[10px] tracking-widest text-green-600 font-bold uppercase py-1 px-3 bg-green-50 rounded-full">
                    {product.countInStock} In Stock
                  </span>
                ) : (
                  <span className="ml-auto text-[10px] tracking-widest text-red-600 font-bold uppercase py-1 px-3 bg-red-50 rounded-full">Mined Out</span>
                )}
              </div>
              <div 
                className="text-gray-500 text-base leading-relaxed font-light tracking-wide html-content"
                dangerouslySetInnerHTML={{ __html: product.short_description_html || (product.long_description_html && product.long_description_html.length > 150 ? product.long_description_html.substring(0, 150) + '...' : product.long_description_html) }}
              />

              {/* Top Metadata Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                {product.categories && product.categories.length > 0 && (
                  <div className="meta-item !mb-2">
                    <span className="meta-label !text-[11px] uppercase tracking-wider">Categories:</span>
                    <span className="meta-values !text-[11px] uppercase tracking-wider">
                      {product.categories.join(', ')}
                    </span>
                  </div>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div className="meta-item">
                    <span className="meta-label !text-[11px] uppercase tracking-wider">Tags:</span>
                    <span className="meta-values !text-[11px] uppercase tracking-wider">
                      {product.tags.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-200 h-14">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-6 h-full hover:bg-gray-50 transition-colors">-</button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-6 h-full hover:bg-gray-50 transition-colors">+</button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.countInStock === 0}
                  className="flex-1 bg-gray-900 text-white h-14 uppercase tracking-[0.2em] text-xs font-bold hover:bg-theme-rust transition-all flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} /> {product.countInStock === 0 ? 'Mined Out' : 'Add to Sacred Bag'}
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                disabled={product.countInStock === 0}
                className="w-full bg-theme-rust text-white h-14 uppercase tracking-[0.2em] text-xs font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-xl shadow-theme-rust/10"
              >
                 Summon Now (Buy Now)
              </button>
            </div>


            {/* Toast Notification */}
            <AnimatePresence>
              {showToast && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-sm shadow-2xl z-[100] flex items-center gap-4 text-xs font-bold uppercase tracking-widest border border-theme-rust/20"
                >
                  <div className="w-2 h-2 bg-theme-rust rounded-full animate-pulse"></div>
                  Artifact Added to Your Collection
                </motion.div>
              )}
            </AnimatePresence>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
               <div className="flex flex-col items-center text-center p-4">
                  <Truck size={24} className="text-theme-rust mb-4" />
                  <h4 className="text-[10px] uppercase font-bold tracking-widest mb-2">Free Shipping</h4>
                  <p className="text-[9px] text-gray-400 uppercase tracking-tighter">On orders above ₹2500</p>
               </div>
               <div className="flex flex-col items-center text-center p-4">
                  <ShieldCheck size={24} className="text-theme-rust mb-4" />
                  <h4 className="text-[10px] uppercase font-bold tracking-widest mb-2">100% Authentic</h4>
                  <p className="text-[9px] text-gray-400 uppercase tracking-tighter">Certified Origin</p>
               </div>
               <div className="flex flex-col items-center text-center p-4">
                  <RefreshCw size={24} className="text-theme-rust mb-4" />
                  <h4 className="text-[10px] uppercase font-bold tracking-widest mb-2">Ritual Returns</h4>
                  <p className="text-[9px] text-gray-400 uppercase tracking-tighter">15 Day Guarantee</p>
               </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-20 md:mt-32">
          <div className="flex justify-center border-b border-gray-100 mb-12">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-8 md:px-12 pb-5 text-2xl md:text-3xl font-serif transition-all ${activeTab === 'description' ? 'text-gray-900 border-b border-[#a66a4a]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 md:px-12 pb-5 text-2xl md:text-3xl font-serif transition-all ${activeTab === 'reviews' ? 'text-gray-900 border-b border-[#a66a4a]' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Reviews ({product.numReviews || 0})
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4">
            {activeTab === 'description' ? (
              <div 
                className="text-gray-500 leading-relaxed font-light html-content"
                dangerouslySetInnerHTML={{ __html: product.long_description_html }}
              />
            ) : (
              <div className="space-y-12">
                {product.reviews.length === 0 && (
                  <div className="text-center text-gray-500 py-16 font-serif italic text-xl">
                    The resonance of this artifact has yet to be documented by other seekers.
                  </div>
                )}
                
                <div className="space-y-8">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="bg-white p-6 md:p-8 rounded-sm border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 uppercase tracking-tight">{review.name}</h4>
                        <div className="flex items-center text-theme-rust">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4">{new Date(review.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-600 font-light text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-6 md:p-10 rounded-sm border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-gray-900">Share Your Resonance</h3>
                  {userInfo ? (
                    <form onSubmit={submitReviewHandler} className="space-y-6">
                      {reviewError && <div className="p-3 bg-red-50 text-red-600 text-xs uppercase tracking-widest mb-4 border border-red-100 font-bold">{reviewError}</div>}
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 block">Rating ({rating})</label>
                        <div className="flex gap-2 text-theme-rust cursor-pointer">
                           {[1, 2, 3, 4, 5].map((num) => (
                             <Star 
                               key={num} 
                               size={24} 
                               fill={rating >= num ? "currentColor" : "none"} 
                               onClick={() => setRating(num)}
                               className="hover:scale-110 transition-transform"
                             />
                           ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 mb-2 block">Your Experience</label>
                        <textarea 
                          rows="4" 
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Describe the energy it brought to your space..."
                          className="w-full bg-white border border-gray-200 p-4 rounded-sm focus:ring-1 focus:ring-theme-rust outline-none transition-all font-light text-sm text-gray-700"
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        disabled={reviewLoading}
                        className="bg-gray-900 text-white px-8 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-theme-rust transition-all disabled:opacity-50"
                      >
                         {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-sm text-gray-600 font-light p-4 border border-gray-200 bg-white">
                      Please <Link to="/login" className="text-theme-rust font-bold hover:underline">sign in</Link> to share your resonance.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
