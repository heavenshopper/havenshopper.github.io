import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchProducts } from './utils';
import { Product, CategoryKey } from './types';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';
import ImageZoomModal from './components/ImageZoomModal';
import ContactWidget from './components/ContactWidget';
import { Sparkles, Calendar, BadgeCheck, Flame } from 'lucide-react';

const VALID_CATEGORIES: CategoryKey[] = [
  'new',
  'gaming',
  'gadget it',
  'music equipment',
  'common',
  'motorcycle/car parts',
  'sport',
  'promotion'
];

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [zoomImage, setZoomImage] = useState<{ url: string; alt: string } | null>(null);

  // Last update timestamp
  const [lastUpdatedText, setLastUpdatedText] = useState('อัปเดตเรียลไทม์');

  // Load products on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchProducts();
        setProducts(data);
        
        // Dynamically set realistic last update time if products exist
        if (data.length > 0) {
          const now = new Date();
          const timeString = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
          setLastUpdatedText(`อัปเดตวันนี้ล่าสุดเมื่อ ${timeString} น.`);
        }
      } catch (err: any) {
        setError(err.message || 'ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาตรวจสอบอินเทอร์เน็ต');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter & sort effect
  useEffect(() => {
    let result = [...products];

    // 1. Filter by category
    if (activeCategory === 'all') {
      result = result.filter(p => VALID_CATEGORIES.includes(p.category as CategoryKey || 'new'));
    } else {
      result = result.filter(p => (p.category || 'new') === activeCategory);
    }

    // 2. Apply text search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.detail && p.detail.toLowerCase().includes(q))
      );
    }

    // 3. Apply sorting
    if (sortOrder === 'asc') {
      result.sort((a, b) => {
        const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0;
        const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
        return priceA - priceB;
      });
    } else if (sortOrder === 'desc') {
      result.sort((a, b) => {
        const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0;
        const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
        return priceB - priceA;
      });
    } else {
      // Default: sort by newest first (highest rowIndex)
      result.sort((a, b) => (b._rowIndex || 0) - (a._rowIndex || 0));
    }

    setFilteredProducts(result);
  }, [products, activeCategory, searchQuery, sortOrder]);

  const handleZoomImage = (url: string, alt: string) => {
    setZoomImage({ url, alt });
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortOrder('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 pb-20">
      
      {/* Decorative background visual elements */}
      <div className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-indigo-100/40 via-purple-100/20 to-transparent dark:from-indigo-950/20 dark:via-transparent dark:to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-200/10 dark:bg-indigo-900/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-pink-200/10 dark:bg-pink-900/5 blur-[120px] pointer-events-none" />

      {/* Glassy Header */}
      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        totalProductsCount={filteredProducts.length}
      />

      {/* Bento Grid Dashboard Summary Cards */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 mt-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Bento Card 1: Main Welcome & Total Count */}
          <div className="md:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  คลังสินค้าพร้อมส่ง
                </span>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 mt-2 tracking-tight">
                  HEAVEN SHOPPER
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                  เช็คสถานะสินค้า อัปเดตสต็อกเรียลไทม์ ตลอด 24 ชม.
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                  {filteredProducts.length}
                </span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1">
                  รายการพร้อมส่ง
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2 items-center text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                🚀 จัดส่งด่วนทุกวัน
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                💳 มีปลายทาง
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                💯 ของแท้แน่นอน
              </span>
            </div>
          </div>

          {/* Bento Card 2: Active Category Status widget */}
          <div className="md:col-span-3 bg-slate-900 dark:bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <span className="bg-white/10 text-white border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                กำลังเลือกดู
              </span>
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-400 flex items-center justify-center text-[8px] font-bold text-white">HS</div>
                <div className="w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white">LIVE</div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-3xl font-light capitalize truncate text-indigo-400">
                {activeCategory === 'all' ? 'ทุกหมวดหมู่' : activeCategory}
              </h3>
              <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest font-bold">
                หมวดหมู่สินค้าที่กรองอยู่
              </p>
            </div>
          </div>

          {/* Bento Card 3: Clock & Refresh indicators */}
          <div className="md:col-span-3 bg-indigo-600 dark:bg-indigo-950/40 dark:border dark:border-indigo-900/30 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xs">
            <div className="flex justify-between items-start">
              <span className="bg-indigo-500/30 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                อัปเดตล่าสุด
              </span>
              <Flame size={18} className="text-amber-400 animate-pulse" />
            </div>

            <div className="mt-4">
              <span className="text-sm font-semibold block leading-tight text-indigo-200">
                สถานะสต็อกสินค้า
              </span>
              <span className="text-base font-bold block mt-1">
                {lastUpdatedText.replace('อัปเดตวันนี้ล่าสุดเมื่อ ', '').replace(' น.', ' น.')}
              </span>
              <span className="text-[10px] text-indigo-200 block mt-1.5 font-medium italic">
                * ดึงข้อมูลตรงจากระบบคลังจริง
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main product catalogue section */}
      <div className="relative z-10 mt-2">
        <ProductGrid
          products={filteredProducts}
          isLoading={isLoading}
          error={error}
          onProductClick={setSelectedProduct}
          onZoomImage={handleZoomImage}
          onResetSearch={handleResetSearch}
        />
      </div>

      {/* Contact floating tool */}
      <ContactWidget />

      {/* Product Detailed modal (Quick View) */}
      <QuickViewModal
        isOpen={selectedProduct !== null}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onZoomImage={handleZoomImage}
      />

      {/* Image Lightbox (Zoom Modal) */}
      <ImageZoomModal
        isOpen={zoomImage !== null}
        imageUrl={zoomImage?.url || ''}
        imageAlt={zoomImage?.alt || ''}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}
