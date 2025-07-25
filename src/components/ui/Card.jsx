import React from 'react';

const Card = ({ title, description, children, className, headerAction }) => (
  <section
    // --- CHANGES ARE HERE ---
    // Added transition utilities and a hover state for the border.
    className={`bg-surface rounded-xl p-6 sm:p-8 border border-white/5 
                transition-colors duration-200 hover:border-white/20 ${className}`}
  >
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-2xl font-bold text-primary-text">{title}</h2>
      {headerAction}
    </div>

    {description && (
      <p className="text-sm mb-6 text-secondary-text">{description}</p>
    )}
    {children}
  </section>
);

export default Card;
