import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Feature } from './Feature';

interface LandingPageProps {
  onStartSplit: () => void;
}

export function LandingPage({ onStartSplit }: LandingPageProps) {
  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6 text-center"
      >
        <h1 className="text-4xl font-bold mb-4">
          Split Bills Effortlessly
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          A simple way to split bills among friends and handle single-payer scenarios
        </p>

        <div className="grid gap-6 md:grid-cols-3 text-left mb-8">
          <Feature
            title="Easy Setup"
            description="Enter bill details and add people in just a few steps"
          />
          <Feature
            title="Smart Splitting"
            description="Specify who participated in each item for accurate splitting"
          />
          <Feature
            title="Single Payer"
            description="Handle scenarios where one person pays a larger share"
            isBeta={true}
          />
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartSplit}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-full font-medium shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-colors"
          >
            Begin Split
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Some features are in beta and may be updated based on user feedback
          </p>
        </div>
      </motion.div>
    </div>
  );
}