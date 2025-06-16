import React, { useState, useEffect, useRef } from 'react';
import { COLOR_PALETTE } from '../../utils/constants';

const ColorPicker = ({ selectedColor, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className="w-6 h-6 rounded-full border-2 border-[#555] cursor-pointer transition-colors hover:border-primary-text"
        style={{ backgroundColor: selectedColor }}
        onClick={() => setIsOpen(!isOpen)}
      ></div>
      {isOpen && (
        <div className="absolute top-[120%] left-1/2 -translate-x-1/2 bg-input-bg p-2.5 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.4)] z-10 w-max">
          {Object.entries(COLOR_PALETTE).map(([name, colors]) => (
            <div key={name} className="p-1">
              <p className="text-xs text-secondary-text mb-3 text-left">
                {name}
              </p>
              <div className="grid grid-cols-7 gap-2">
                {colors.map((color) => (
                  <div
                    key={color}
                    className="w-[22px] h-[22px] rounded-full cursor-pointer transition-transform hover:scale-110 hover:ring-2 hover:ring-white"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onColorChange(color);
                      setIsOpen(false);
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
