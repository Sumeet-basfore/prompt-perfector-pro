import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface OnboardingTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  arrowClassName?: string;
}

export const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
  className = '',
  arrowClassName = '',
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return { bottom: 'calc(100% + 12px)', left: '50%', x: '-50%' };
      case 'bottom':
        return { top: 'calc(100% + 12px)', left: '50%', x: '-50%' };
      case 'left':
        return { right: 'calc(100% + 12px)', top: '50%', y: '-50%' };
      case 'right':
        return { left: 'calc(100% + 12px)', top: '50%', y: '-50%' };
      default:
        return {};
    }
  };

  const getArrowStyles = () => {
    switch (position) {
      case 'top':
        return 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-primary/80 border-b-transparent border-l-transparent border-r-transparent';
      case 'bottom':
        return 'top-[-6px] left-1/2 -translate-x-1/2 border-b-primary/80 border-t-transparent border-l-transparent border-r-transparent';
      case 'left':
        return 'right-[-6px] top-1/2 -translate-y-1/2 border-l-primary/80 border-r-transparent border-t-transparent border-b-transparent';
      case 'right':
        return 'left-[-6px] top-1/2 -translate-y-1/2 border-r-primary/80 border-l-transparent border-t-transparent border-b-transparent';
      default:
        return '';
    }
  };

  const getInitialAnimation = () => {
    switch (position) {
      case 'top': return { opacity: 0, y: 10, x: '-50%', scale: 0.95 };
      case 'bottom': return { opacity: 0, y: -10, x: '-50%', scale: 0.95 };
      case 'left': return { opacity: 0, x: 10, y: '-50%', scale: 0.95 };
      case 'right': return { opacity: 0, x: -10, y: '-50%', scale: 0.95 };
      default: return { opacity: 0, scale: 0.95 };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={getInitialAnimation()}
          animate={{ opacity: 1, y: position === 'left' || position === 'right' ? '-50%' : 0, x: position === 'top' || position === 'bottom' ? '-50%' : 0, scale: 1 }}
          exit={getInitialAnimation()}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={`absolute z-[100] w-64 p-3 bg-primary/95 text-primary-foreground backdrop-blur-md rounded-xl shadow-2xl border border-primary-foreground/20 ${className}`}
          style={getPositionStyles()}
        >
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-[6px] ${getArrowStyles()} ${arrowClassName}`} />

          <div className="flex justify-between items-start mb-1 gap-2">
            {title && <h4 className="font-semibold text-sm leading-tight">{title}</h4>}
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 -mt-1 -mr-1 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 shrink-0 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-sm text-primary-foreground/90 leading-relaxed">
            {children}
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              size="sm"
              variant="secondary"
              className="h-7 text-xs bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Got it
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
