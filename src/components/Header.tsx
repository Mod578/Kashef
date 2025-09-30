import React from 'react';
import { FaSun, FaMoon, FaVial, FaHistory } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';
import { Logo } from './Logo';
import { DEMO_USE_CASE_ICONS } from '../constants';
import { useAppContext } from '../context/AppContext';
import { DEMO_DATA } from '../data/demoData';

interface HeaderProps {
  onOpenAboutModal: () => void;
  onOpenDemoModal: () => void;
  onOpenHistoryModal: () => void;
}

/**
 * A reusable button component for the application header.
 *
 * @param {object} props - The component props.
 * @param {() => void} props.onClick - The function to call when the button is clicked.
 * @param {boolean} [props.isActive=false] - Whether the button is in an active state.
 * @param {string} props.title - The accessible label and tooltip for the button.
 * @param {React.ReactNode} props.children - The icon or content to display inside the button.
 * @returns {React.ReactElement} The rendered header button.
 */
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

/**
 * The main header for the application.
 * Displays the application title/logo and provides controls for theme switching,
 * opening modals (About, History, Demo), and indicating the current mode.
 *
 * @param {HeaderProps} props - The component props.
 * @returns {React.ReactElement} The rendered application header.
 */
const Header: React.FC<HeaderProps> = ({ onOpenAboutModal, onOpenDemoModal, onOpenHistoryModal }) => {
  const { state, dispatch } = useAppContext();
  const { theme, isDemoMode, demoUseCase } = state;

  const toggleTheme = () => {
    dispatch({ type: 'SET_THEME', payload: theme === 'dark' ? 'light' : 'dark' });
  };
  
  const DemoIcon = isDemoMode && demoUseCase ? DEMO_USE_CASE_ICONS[demoUseCase] : null;
  const title = isDemoMode && demoUseCase ? DEMO_DATA[demoUseCase].title : "كاشف";

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 h-16 bg-brand-surface border-b border-brand-border z-50">
      {/* Right side (First in DOM for RTL) */}
      <div className="flex items-center gap-3 min-w-0">
        {DemoIcon ? (
           <DemoIcon className="w-7 h-7 text-brand-primary" />
        ) : (
           <Logo className="w-9 h-9 text-brand-primary" />
        )}
        <h1 className="font-display text-2xl font-bold text-brand-text-primary tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* Left side (Last in DOM for RTL) */}
      <div className="flex items-center gap-1">
        <HeaderButton onClick={onOpenAboutModal} title="حول التطبيق">
            <FaCircleInfo className="w-5 h-5" />
        </HeaderButton>
        <HeaderButton onClick={onOpenHistoryModal} title="سجل الفحوصات">
            <FaHistory className="w-5 h-5" />
        </HeaderButton>
        <HeaderButton onClick={toggleTheme} title={theme === 'dark' ? 'التحويل للوضع الفاتح' : 'التحويل للوضع الداكن'}>
            {theme === 'dark' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
        </HeaderButton>
         <HeaderButton onClick={onOpenDemoModal} isActive={isDemoMode} title="الوضع التجريبي">
            <FaVial className="w-5 h-5" />
        </HeaderButton>
      </div>
    </header>
  );
};

export default React.memo(Header);
