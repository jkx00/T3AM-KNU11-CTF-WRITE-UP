
import React from 'react';
import type { Writeup } from '../types';

interface WriteupCardProps {
  writeup: Writeup;
  onSelect: (writeup: Writeup) => void;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}

const difficultyColorMap = {
  Easy: 'text-gray-400',
  Medium: 'text-gray-300',
  Hard: 'text-gray-100',
  Insane: 'text-white font-bold',
};

const WriteupCard: React.FC<WriteupCardProps> = ({ writeup, onSelect, isAdmin, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card's onSelect from firing
    onDelete(writeup.id);
  };

  return (
    <div
      className="card-border group relative cursor-pointer bg-black bg-opacity-50 border border-gray-700 p-6 transition-all duration-300 hover:bg-gray-900/80 hover:border-gray-400 flex flex-col h-full"
      onClick={() => onSelect(writeup)}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-grid-cyan opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <div className="relative z-10 flex flex-col flex-grow">
        <h3 className="text-xl text-gray-200 group-hover:text-white transition-colors duration-300 mb-2">{writeup.title}</h3>
        
        <div className="font-mono text-xs text-gray-500 mb-4">
          <span>{writeup.category.toUpperCase()}</span>
          <span className="mx-2">/</span>
          <span className={difficultyColorMap[writeup.difficulty]}>{writeup.difficulty.toUpperCase()}</span>
        </div>

        <p className="font-mono text-sm text-gray-400 mb-4 flex-grow">{writeup.description}</p>
        
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
            <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-gray-500">
                    // author: {writeup.author}
                </span>
                {isAdmin && (
                    <button
                        onClick={handleDelete}
                        className="font-mono text-xs text-red-500/70 hover:text-red-400 transition-colors"
                        aria-label={`Delete writeup titled ${writeup.title}`}
                    >
                        [DELETE]
                    </button>
                )}
            </div>
            <span className="text-xs text-gray-400 group-hover:text-white transition-colors duration-300">
                Read More &gt;&gt;
            </span>
        </div>
      </div>
    </div>
  );
};

export default WriteupCard;
