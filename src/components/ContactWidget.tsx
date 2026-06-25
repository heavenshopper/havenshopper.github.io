import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Phone, MessageCircle, X, ChevronRight, Share2 } from 'lucide-react';

export default function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);

  // Stop pulsing once the user has opened the menu once
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setShouldPulse(false);
  };

  const handleOpenMessenger = () => {
    window.open('https://www.facebook.com/share/19eN49NTUR/?mibextid=wwXIfr', '_blank');
    setIsOpen(false);
  };

  const handleOpenLine = () => {
    window.open('https://line.me/R/ti/p/sreenoomhihi', '_blank');
    setIsOpen(false);
  };

  const handleCall = () => {
    window.open('tel:0801234567', '_self'); // Standard dynamic fallback
    setIsOpen(false);
  };

  return (
    <>
      {/* Dim Overlay when contact widget is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-40 transition-all duration-300"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {/* Contact Menu Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="glass-panel w-[320px] rounded-2xl p-5 mb-4 shadow-2xl overflow-hidden relative"
            >
              <div className="text-center mb-5">
                <h3 className="text-slate-800 font-bold text-lg">ช่องทางการติดต่อ</h3>
                <p className="text-slate-500 text-xs mt-1">เลือกช่องทางที่คุณสะดวกเพื่อสอบถามสินค้า</p>
              </div>

              <div className="space-y-3">
                {/* Facebook Messenger */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenMessenger}
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 rounded-xl transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00B2FF] to-[#006AFF] flex items-center justify-center text-white shadow-md">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">Messenger</div>
                      <div className="text-slate-500 text-xs">ติดต่อผ่าน Facebook Messenger</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-indigo-400" />
                </motion.button>

                {/* LINE */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenLine}
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:border-green-200 rounded-xl transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C300] to-[#00B900] flex items-center justify-center text-white shadow-md">
                      <MessageCircle size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">LINE ID</div>
                      <div className="text-slate-500 text-xs">ติดต่อเราผ่าน LINE Official</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-green-500" />
                </motion.button>

                {/* Call Phone */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCall}
                  className="w-full flex items-center justify-between p-3.5 bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 hover:border-rose-200 rounded-xl transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF5722] flex items-center justify-center text-white shadow-md">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">เบอร์โทรศัพท์</div>
                      <div className="text-slate-500 text-xs">โทรติดต่อสายตรงกับเรา</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-rose-400" />
                </motion.button>
              </div>

              {/* Mini corner arrow indicator matching floating design */}
              <div className="absolute bottom-0 right-7 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white border border-slate-100 hidden sm:block" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button (FAB) */}
        <motion.button
          onClick={handleToggle}
          animate={shouldPulse && !isOpen ? {
            boxShadow: [
              "0 8px 25px rgba(99, 102, 241, 0.4)",
              "0 8px 25px rgba(99, 102, 241, 0.7), 0 0 0 12px rgba(99, 102, 241, 0.15)",
              "0 8px 25px rgba(99, 102, 241, 0.4)"
            ]
          } : {}}
          transition={shouldPulse && !isOpen ? { repeat: Infinity, duration: 2.2, ease: "easeInOut" } : {}}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer border-none outline-none transition-colors duration-300 ${
            isOpen
              ? 'bg-gradient-to-br from-rose-500 to-orange-500 rotate-45'
              : 'bg-gradient-to-br from-indigo-500 to-violet-600'
          }`}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.button>
      </div>
    </>
  );
}
