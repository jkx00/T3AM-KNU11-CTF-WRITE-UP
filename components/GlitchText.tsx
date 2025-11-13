import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className }) => {
  return (
    <h1 className={`glitch text-4xl md:text-6xl font-bold uppercase tracking-widest ${className}`} data-text={text}>
      {text}
    </h1>
  );
};

export default GlitchText;