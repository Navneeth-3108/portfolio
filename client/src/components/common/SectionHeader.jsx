import React from 'react';

const SectionHeader = ({ title, subtitle, align = 'left' }) => {
  return (
    <div style={{ textAlign: align }} className="section-header animate-fade-in">
      {subtitle && (
        <span className="section-subtitle">
          {subtitle}
        </span>
      )}
      <h2 className="section-title">
        {title}
      </h2>
    </div>
  );
};

export default SectionHeader;
