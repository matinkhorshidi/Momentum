import React, { useState, useLayoutEffect } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  FloatingPortal,
} from '@floating-ui/react-dom-interactions';
import { motion, AnimatePresence } from 'framer-motion';

export const Popover = ({ trigger, content, placement = 'bottom-start' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context, update } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'absolute',
    placement,
    middleware: [offset(10), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const floatingStyles = {
    position: strategy,
    top: y ?? 0,
    left: x ?? 0,
  };

  useLayoutEffect(() => {
    if (isOpen && refs.reference.current && refs.floating.current) {
      console.log(
        'Reference:',
        refs.reference.current?.getBoundingClientRect()
      );
      console.log('Floating:', refs.floating.current?.getBoundingClientRect());
      console.log('floatingStyles', floatingStyles);
      update();
    }
  }, [isOpen, refs.reference, refs.floating, update, x, y]);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context),
  ]);

  return (
    <>
      {React.cloneElement(
        trigger,
        getReferenceProps({ ref: refs.setReference, ...trigger.props })
      )}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
              <motion.div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="bg-surface border border-white/10 rounded-lg shadow-2xl z-50"
              >
                {React.cloneElement(content, { close: () => setIsOpen(false) })}
              </motion.div>
            </FloatingFocusManager>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};
