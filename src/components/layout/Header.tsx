import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { BarChart3, BookOpen, ClipboardList, Home, Menu, Trophy, Users, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: '首页', icon: <Home size={20} />, path: '/' },
  { id: 'diagnosis', label: '诊断中心', icon: <BarChart3 size={20} />, path: '/diagnosis' },
  { id: 'learning-path', label: '学习路径', icon: <BookOpen size={20} />, path: '/learning-path' },
  { id: 'daily', label: '每日推荐', icon: <ClipboardList size={20} />, path: '/daily' },
  { id: 'mistakes', label: '错题归因', icon: <Trophy size={20} />, path: '/mistakes' },
  { id: 'parent', label: '家长报告', icon: <Users size={20} />, path: '/parent/report' },
];

export const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // 滚动时加深背景
  const headerBg = useTransform(
    scrollY,
    [0, 50, 100],
    [
      'rgba(15, 23, 42, 0.7)',
      'rgba(15, 23, 42, 0.85)',
      'rgba(15, 23, 42, 0.95)'
    ]
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 50, 100],
    ['blur(12px)', 'blur(16px)', 'blur(20px)']
  );
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      style={{
        backgroundColor: headerBg,
        backdropFilter: useTransform(backdropBlur, (v) => `saturate(180%) ${v}`) as unknown as string,
      }}
      className="sticky top-0 z-50 border-b border-white/10"
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-primary-500 via-indigo-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="text-white font-bold text-sm">OI</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-300 via-indigo-300 to-accent-300 bg-clip-text text-transparent">
              信奥赛诊断系统
            </span>
          </motion.div>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-300 border border-primary-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.icon}
                  </motion.span>
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-dark-700/95 backdrop-blur-xl border-t border-white/10"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-300 border border-primary-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
