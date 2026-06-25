import React from 'react';
import { motion } from 'motion/react';
import { Eye, ShoppingBag, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onClick: () => void;
  onZoomImage: (url: string, alt: string) => void;
}

export default function ProductCard({ product, onClick, onZoomImage }: ProductCardProps) {
  const priceDisplay = typeof product.price === 'number' 
    ? product.price.toLocaleString('th-TH') 
    : product.price;

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening detailed modal
    onZoomImage(product.image, product.name);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-3.5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden select-none"
    >
      {/* Decorative colored top line on hover */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

      {/* Image Container */}
      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 relative border border-slate-100/50 dark:border-slate-800/50 group-hover:shadow-md transition-shadow">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=500&auto=format&fit=crop&q=60';
          }}
        />

        {/* Float tags */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 bg-slate-900/75 dark:bg-slate-800/80 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wide rounded-md uppercase">
            {product.category || 'ทั่วไป'}
          </span>
        </div>

        {/* Hover zoom/detail triggers overlay */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={handleZoomClick}
            className="p-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
            title="ขยายรูปใหญ่"
          >
            <Eye size={16} />
          </button>
          {product.shopeeLink && (
            <a
              href={product.shopeeLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
              title="ดูลิงก์ Shopee"
            >
              <ShoppingBag size={16} />
            </a>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 justify-between mt-3 px-1">
        <div>
          {/* Product Name */}
          <h3 className="text-[13px] font-medium text-slate-800 dark:text-slate-100 leading-snug line-clamp-2 min-h-[38px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>

          {/* Subtitle / category */}
          <div className="flex items-center gap-1.5 mt-2.5 text-slate-400 dark:text-slate-500 text-[11px]">
            <Tag size={10} />
            <span className="capitalize">{product.category || 'ทั่วไป'}</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-4">
          <div className="w-full py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100/30 dark:border-slate-800/40 text-center font-bold text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-950/20 group-hover:border-indigo-100/30 dark:group-hover:border-indigo-900/20 transition-all">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mr-1.5">ราคา</span>
            <span className="text-sm font-extrabold">{priceDisplay}</span>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 ml-1">บาท</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
