import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  LayoutGrid, 
  Flame, 
  Bookmark, 
  Gamepad2, 
  Smartphone, 
  Wrench, 
  Trophy, 
  Music,
  ShoppingBag,
  Info
} from 'lucide-react';
import { CategoryKey, CategoryInfo } from '../types';

interface HeaderProps {
  activeCategory: CategoryKey;
  setActiveCategory: (cat: CategoryKey) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  totalProductsCount: number;
}

const CATEGORIES: CategoryInfo[] = [
  { key: 'all', label: '📦 รวมสินค้า', iconName: 'LayoutGrid' },
  { key: 'new', label: '🎉 สินค้าเข้าใหม่!', iconName: 'Sparkles' },
  { key: 'promotion', label: '🔥 โปรโมชั่น', iconName: 'Flame' },
  { key: 'common', label: '🔖 ทั่วไป', iconName: 'Bookmark' },
  { key: 'gaming', label: '🎮 เกมมิ่ง', iconName: 'Gamepad2' },
  { key: 'gadget it', label: '📱 ไอที', iconName: 'Smartphone' },
  { key: 'motorcycle/car parts', label: '🚗 อะไหล่รถ', iconName: 'Wrench' },
  { key: 'sport', label: '⚽ กีฬา', iconName: 'Trophy' },
  { key: 'music equipment', label: '🎸 ดนตรี', iconName: 'Music' },
];

export default function Header({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
  totalProductsCount,
}: HeaderProps) {
  const [isCompact, setIsCompact] = useState(false);
  const { scrollY } = useScroll();

  // Handle compact header transformation on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsCompact(latest > 60);
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return <Sparkles size={14} className="mr-1.5" />;
      case 'Flame': return <Flame size={14} className="mr-1.5" />;
      case 'Bookmark': return <Bookmark size={14} className="mr-1.5" />;
      case 'Gamepad2': return <Gamepad2 size={14} className="mr-1.5" />;
      case 'Smartphone': return <Smartphone size={14} className="mr-1.5" />;
      case 'Wrench': return <Wrench size={14} className="mr-1.5" />;
      case 'Trophy': return <Trophy size={14} className="mr-1.5" />;
      case 'Music': return <Music size={14} className="mr-1.5" />;
      default: return <LayoutGrid size={14} className="mr-1.5" />;
    }
  };

  return (
    <motion.header
      animate={{ 
        paddingTop: isCompact ? '10px' : '20px',
        paddingBottom: isCompact ? '10px' : '20px',
        backgroundColor: isCompact ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.85)'
      }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-[100] w-full backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/20 shadow-xs transition-shadow duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Top brand row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.img 
              src="https://drive.google.com/thumbnail?id=1HGxfThUV4U5VxnmLAngTf5VqICV5ZV1l"
              alt="Heaven Shopper Logo" 
              className="object-contain"
              animate={{ height: isCompact ? 36 : 48 }}
              transition={{ duration: 0.2 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&auto=format&fit=crop&q=60";
              }}
            />
            <div>
              <motion.h1 
                animate={{ fontSize: isCompact ? '1.25rem' : '1.5rem' }}
                transition={{ duration: 0.2 }}
                className="font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight leading-none"
              >
                HEAVEN SHOPPER
              </motion.h1>
              {!isCompact && (
                <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-wider uppercase">
                  ตารางเช็คสินค้าพร้อมส่ง
                </p>
              )}
            </div>
          </div>

          {/* Search, Filter & Stats Group */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-center md:justify-end">
            {/* System Status - Bento Classic */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Stock System Live</span>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 md:flex-initial min-w-[200px] md:min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="ค้นหาชื่อสินค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 focus:border-indigo-500 rounded-full text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none transition-colors shadow-xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md"
                >
                  ล้าง
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 hover:border-slate-300 dark:border-slate-800 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer transition-colors shadow-xs"
              >
                <option value="">เรียงราคา</option>
                <option value="asc">ราคา: น้อย → มาก</option>
                <option value="desc">ราคา: มาก → น้อย</option>
              </select>
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
            </div>

            {/* Stats Badge */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold shadow-xs">
              <ShoppingBag size={13} />
              <span>{totalProductsCount} รายการ</span>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-4 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex gap-2 pb-1 pr-4 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <motion.button
                  key={cat.key}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wide cursor-pointer transition-all duration-200 shadow-xs ${
                    isActive
                      ? 'bg-slate-900 dark:bg-indigo-600 text-white border border-slate-900 dark:border-indigo-600'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {getIcon(cat.iconName)}
                  <span>{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
