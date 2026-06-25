import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  onProductClick: (product: Product) => void;
  onZoomImage: (url: string, alt: string) => void;
  onResetSearch: () => void;
}

export default function ProductGrid({
  products,
  isLoading,
  error,
  onProductClick,
  onZoomImage,
  onResetSearch,
}: ProductGridProps) {
  
  // Loading skeletons matching the product card aspect ratios
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i} 
              className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-3.5 space-y-4 animate-pulse shadow-xs"
            >
              <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-2xl" />
              <div className="space-y-2 px-1">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-md w-4/5" />
                <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-2/3" />
              </div>
              <div className="pt-2">
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-4 border border-rose-100">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
        <p className="text-slate-500 text-sm max-w-md mt-1.5">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full shadow-md cursor-pointer transition-colors"
        >
          <RefreshCw size={14} />
          <span>โหลดข้อมูลอีกครั้ง</span>
        </button>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4 border border-slate-100">
          <Search size={28} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">ไม่พบสินค้าที่คุณค้นหา</h3>
        <p className="text-slate-500 text-sm max-w-md mt-1.5">
          กรุณาลองระบุชื่อสินค้าหรือเลือกหมวดหมู่ที่เหมาะสมอีกครั้ง
        </p>
        <button
          onClick={onResetSearch}
          className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-md cursor-pointer transition-colors"
        >
          ล้างตัวกรองและแสดงทั้งหมด
        </button>
      </div>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Product Grid - Custom responsive cols to match requested layout */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <ProductCard
              key={`${product._rowIndex}-${product.name}`}
              product={product}
              onClick={() => onProductClick(product)}
              onZoomImage={onZoomImage}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
