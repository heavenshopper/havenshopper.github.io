import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ShoppingBag, MessageSquare, MessageCircle, Share2, Check, Copy } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onZoomImage: (url: string, alt: string) => void;
}

export default function QuickViewModal({ isOpen, product, onClose, onZoomImage }: QuickViewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const handleCopyLink = () => {
    const shareText = `สินค้า: ${product.name}\nราคา: ${product.price} บาท\nรายละเอียด: ${product.detail}\nลิงก์สั่งซื้อ Shopee: ${product.shopeeLink || 'ไม่มี'}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInquireMessenger = () => {
    const text = `สวัสดีครับ สนใจสินค้าชิ้นนี้ครับ: ${product.name} (ราคา ${product.price} บาท)`;
    window.open(`https://www.facebook.com/share/19eN49NTUR/?mibextid=wwXIfr`, '_blank');
  };

  const handleInquireLine = () => {
    window.open(`https://line.me/R/ti/p/sreenoomhihi`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col md:flex-row z-[160]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300 cursor-pointer shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Left Column: Image Section */}
            <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-semibold capitalize shadow-sm">
                  {product.category || 'ทั่วไป'}
                </span>
                <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold shadow-sm">
                  พร้อมส่ง
                </span>
              </div>

              <div 
                className="w-full aspect-square max-w-[340px] rounded-2xl overflow-hidden cursor-zoom-in hover:shadow-lg transition-all border border-slate-100 dark:border-slate-800 group relative mt-4 md:mt-0"
                onClick={() => onZoomImage(product.image, product.name)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?w=500&auto=format&fit=crop&q=60';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-all">
                  <span className="bg-white/80 backdrop-blur-xs text-slate-800 text-xs font-medium px-2.5 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    คลิกเพื่อซูมรูปใหญ่
                  </span>
                </div>
              </div>

              <div className="w-full max-w-[340px] mt-6">
                <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-4 text-center">
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">ราคาปัจจุบัน</div>
                  <div className="text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                    {typeof product.price === 'number' ? product.price.toLocaleString('th-TH') : product.price}
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">บาท</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full">
              <div className="space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h3>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                <div className="space-y-2">
                  <h4 className="text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-wider uppercase">
                    รายละเอียดสินค้า
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line max-h-[180px] overflow-y-auto pr-2">
                    {product.detail || 'ไม่มีข้อมูลรายละเอียดเพิ่มเติมสำหรับสินค้าชิ้นนี้'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                {/* Shopee Pricing action */}
                {product.shopeeLink ? (
                  <a
                    href={product.shopeeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-[#ee4d2d] hover:opacity-95 transition-all text-white font-semibold text-sm rounded-xl shadow-md shadow-orange-500/15"
                  >
                    <ShoppingBag size={18} />
                    <span>เปรียบเทียบราคาที่ Shopee</span>
                    <ExternalLink size={14} className="ml-1 opacity-80" />
                  </a>
                ) : (
                  <div className="text-center py-2 text-xs text-slate-400 italic">
                    * ไม่พบลิงก์สินค้าสำหรับสั่งซื้อบน Shopee
                  </div>
                )}

                {/* Social Inquiries */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleInquireMessenger}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>ถาม Messenger</span>
                  </button>

                  <button
                    onClick={handleInquireLine}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                  >
                    <MessageCircle size={16} />
                    <span>สอบถามทาง LINE</span>
                  </button>
                </div>

                {/* Share/Copy link action */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-500 animate-bounce" />
                      <span className="text-emerald-500">คัดลอกข้อมูลสินค้าเรียบร้อย!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>คัดลอกข้อมูล/ลิงก์เพื่อแชร์</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
