import { ReactNode } from 'react';
import { Header } from './Header';

interface AppLayoutProps {
  children: ReactNode;
  theme: 'light' | 'dark';
  showNewSplit: boolean;
  onNewSplit: () => void;
  onInfoClick: () => void;
  showInfoButton: boolean;
}

export function AppLayout({ 
  children, 
  theme, 
  showNewSplit, 
  onNewSplit,
  onInfoClick,
  showInfoButton
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header 
        onNewSplit={onNewSplit} 
        showNewSplit={showNewSplit} 
        onInfoClick={onInfoClick}
        showInfoButton={showInfoButton}
      />
      {children}
    </div>
  );
}