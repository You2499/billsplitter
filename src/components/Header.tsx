import { Moon, Sun, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  onNewSplit: () => void;
  showNewSplit: boolean;
  onInfoClick: () => void;
  showInfoButton: boolean;
}

export function Header({ onNewSplit, showNewSplit, onInfoClick, showInfoButton }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          
          {showInfoButton && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInfoClick}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Show information"
            >
              <Info className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        <h1 className="text-lg font-medium">Split Bill</h1>

        <div className="w-[69px] flex justify-end">
          {showNewSplit && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewSplit}
              className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              New Split
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}