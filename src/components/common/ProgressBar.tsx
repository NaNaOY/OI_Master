import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  className?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  color = '#3b82f6',
  height = 8,
  className = '',
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${className}`} style={{ height: `${height}px` }}>
      <motion.div
        className="rounded-full"
        style={{ backgroundColor: color, height: '100%' }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
};