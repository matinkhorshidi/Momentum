import React from 'react';

const Card = ({ title, description, children, className, headerAction }) => (
  <section
    className={`shadow-lg shadow-black/25 bg-surface rounded-xl p-6 sm:p-8 ${className}`}
  >
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-2xl font-bold text-primary-text">{title}</h2>
      {/* New slot for header actions */}
      {headerAction}
    </div>

    {description && (
      <p className="text-sm mb-6 text-secondary-text">{description}</p>
    )}
    {children}
  </section>
);

export default Card;
