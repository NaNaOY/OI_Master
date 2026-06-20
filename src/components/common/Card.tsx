import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className = '', hover = false }: CardProps) => {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
      {...(hover ? { whileHover: { y: -4, transition: { duration: 0.2 } } } : {})}
    >
      {children}
    </motion.div>
  );
};