import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';
import { Logo } from './Logo';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  onOpenAboutModal: () => void;
}

const HeaderButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    title: string;
    children: React.ReactNode;
}> = ({ onClick, isActive = false, title, children }) => {
    const activeClasses = isActive ? 'bg-brand-primary/20 text-brand-primary' : 'text-brand-text-secondary hover:bg-brand-surface-alt hover:text-brand-text-primary';
    return (
        <button
            onClick={onClick}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${activeClasses}`}
            aria-label={title}
            title={title}
        >
            {children}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ onOpenAboutModal }) => {
  const { state, dispatch } = useAppContext();
  const { theme } = state;

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' });
  };
  
  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 h-16 bg-brand-surface border-b border-brand-border z-50">
      {/* Right side (First in DOM for RTL) */}
      <div className="flex items-center gap-3 min-w-0">
        <Logo className="w-9 h-9 text-brand-primary" />
        <h1 className="font-display text-2xl font-bold text-brand-text-primary tracking-tight truncate">
          كاشف
        </h1>
      </div>

      {/* Left side (Last in DOM for RTL) */}
      <div className="flex items-center gap-1">
        <HeaderButton onClick={onOpenAboutModal} title="حول التطبيق">
            <FaCircleInfo className="w-5 h-5" />
        </HeaderButton>
        <HeaderButton onClick={toggleTheme} title={theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الداكن'}>
            {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </HeaderButton>
      </div>
    </header>
  );
};

export default React.memo(Header);