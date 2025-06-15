import React from 'react';

const Card = ({ title, description, children, className }) => (
  <section className={`bg-surface rounded-xl p-6 sm:p-8 ${className}`}>
    <h2 className="text-2xl font-bold mb-2 text-primary-text">{title}</h2>
    {description && (
      <p className="text-sm mb-6 text-secondary-text">{description}</p>
    )}
    {children}
  </section>
);

export default Card;
