import { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onNewSplit?: () => void;
  showNewSplit?: boolean;
}

export const AppLayout = ({ 
  children, 
  theme, 
  onThemeToggle, 
  onNewSplit, 
  showNewSplit = false 
}: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src="/icon.svg" alt="App Icon" className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {window.location.hostname.includes('food') ? 'FoodSplitter' : 'GrocerySplitter'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {showNewSplit && (
                <button
                  onClick={onNewSplit}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  <span>New Split</span>
                </button>
              )}
              <button
                onClick={onThemeToggle}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="mt-auto py-8 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 ToolKit. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-4">
              <a href="https://toolkit.netlify.app" className="hover:text-gray-700 dark:hover:text-gray-300">ToolKit</a>
              <span>•</span>
              <a href="https://foodsplitter.netlify.app" className="hover:text-gray-700 dark:hover:text-gray-300">FoodSplitter</a>
              <span>•</span>
              <a href="https://grocerysplitter.netlify.app" className="hover:text-gray-700 dark:hover:text-gray-300">GrocerySplitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};