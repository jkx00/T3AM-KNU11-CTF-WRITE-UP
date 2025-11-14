import React from 'react';
import type { Writeup, WriteupCategory, WriteupDifficulty } from '../types';

interface WriteupDetailProps {
  writeup: Writeup;
  onBack: () => void;
  onUpdate: (updatedWriteup: Writeup) => void;
  isAdmin: boolean;
  onDelete: (id: number) => void;
}

const CATEGORIES: WriteupCategory[] = ['Web', 'Crypto', 'Pwn', 'Reverse Engineering', 'Forensics', 'Misc', 'OSINT', 'Steganography', 'Mobile', 'Blockchain'];
const DIFFICULTIES: WriteupDifficulty[] = ['Easy', 'Medium', 'Hard', 'Insane'];

const WriteupDetail: React.FC<WriteupDetailProps> = ({ writeup, onBack, onUpdate, isAdmin, onDelete }) => {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...writeup, [name]: value });
  };

  const handleSolutionChange = (e: React.FormEvent<HTMLDivElement>) => {
    onUpdate({ ...writeup, solution: e.currentTarget.innerHTML });
  };

  const handleDelete = () => {
    onDelete(writeup.id);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate({
        ...writeup,
        attachment: {
          data: reader.result as string,
          mimeType: file.type,
          name: file.name,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = () => {
    onUpdate({ ...writeup, attachment: null });
  };

  const inputStyles = "w-full bg-transparent border-b-2 border-gray-700 focus:border-white outline-none transition-colors duration-300 py-2";
  const labelStyles = "text-sm font-mono text-gray-500 uppercase tracking-widest";
  const sectionStyles = "border-t border-gray-800 pt-6 mt-8";
  
  const ReadOnlyView = () => (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-black/60 border border-gray-700 backdrop-blur-sm">
        <h1 className="text-3xl md:text-4xl text-white font-bold mb-4">{writeup.title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-sm font-mono text-gray-400">
            <span>CATEGORY: {writeup.category}</span>
            <span>DIFFICULTY: {writeup.difficulty}</span>
            <span>AUTHOR: {writeup.author}</span>
        </div>

        <div className={sectionStyles}>
            <h2 className={`${labelStyles} text-2xl text-gray-200 mb-4`}>Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{writeup.description}</p>
        </div>

        <div className={sectionStyles}>
            <h2 className={`${labelStyles} text-2xl text-gray-200 mb-4`}>Solution</h2>
            <div
              dangerouslySetInnerHTML={{ __html: writeup.solution }}
              className="prose prose-invert prose-pre:bg-black/50 prose-pre:border prose-pre:border-gray-700 prose-p:text-gray-300 prose-h2:text-white prose-strong:text-white text-gray-300 leading-relaxed"
            />
        </div>

        {writeup.attachment?.data && (
          <div className={sectionStyles}>
              <h2 className={`${labelStyles} text-2xl text-gray-200 mb-4`}>Attachment</h2>
              {writeup.attachment.mimeType.startsWith('image/') ? (
                  <img src={writeup.attachment.data} alt={writeup.attachment.name} className="max-w-full h-auto rounded-md border border-gray-700" />
              ) : (
                   <a href={writeup.attachment.data} download={writeup.attachment.name} className="font-mono text-white bg-gray-900 inline-block p-2 border border-gray-700 hover:bg-gray-800">
                      Download: {writeup.attachment.name}
                   </a>
              )}
          </div>
        )}

        <div className={sectionStyles}>
            <h2 className={`${labelStyles} text-2xl text-gray-200 mb-4`}>Flag</h2>
            <p className="font-mono text-white bg-gray-900 inline-block p-2 border border-gray-700">{writeup.flag}</p>
        </div>
    </div>
  );

  const EditableView = () => (
     <div className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-black/60 border border-gray-700 backdrop-blur-sm">
        <div className="mb-8">
            <label htmlFor="title" className={labelStyles}>Title</label>
            <input
                id="title"
                name="title"
                type="text"
                value={writeup.title}
                onChange={handleInputChange}
                className={`${inputStyles} text-3xl md:text-4xl text-white font-bold`}
                placeholder="Enter Title..."
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-sm font-mono">
            <div>
                <label htmlFor="category" className={labelStyles}>Category</label>
                <select name="category" id="category" value={writeup.category} onChange={handleInputChange} className={`${inputStyles} text-gray-300 bg-black/60`}>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="difficulty" className={labelStyles}>Difficulty</label>
                <select name="difficulty" id="difficulty" value={writeup.difficulty} onChange={handleInputChange} className={`${inputStyles} text-white bg-black/60`}>
                    {DIFFICULTIES.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="author" className={labelStyles}>Author</label>
                <input
                    id="author"
                    name="author"
                    type="text"
                    value={writeup.author}
                    onChange={handleInputChange}
                    className={`${inputStyles} text-gray-300`}
                    placeholder="Enter Author..."
                />
            </div>
        </div>
        
        <div className={sectionStyles}>
            <label htmlFor="description" className={`${labelStyles} text-2xl text-gray-200 mb-4 block`}>Description</label>
            <textarea
                id="description"
                name="description"
                value={writeup.description}
                onChange={handleInputChange}
                rows={3}
                className={`${inputStyles} text-gray-300 leading-relaxed w-full resize-y`}
                placeholder="Enter a brief description of the challenge..."
            />
        </div>

        <div className={sectionStyles}>
            <h2 className={`${labelStyles} text-2xl text-gray-200 mb-4`}>Solution</h2>
            <div
                contentEditable
                onInput={handleSolutionChange}
                dangerouslySetInnerHTML={{ __html: writeup.solution }}
                className="editable-content min-h-[200px] p-4 bg-black/30 border-2 border-dashed border-gray-800 focus:border-gray-500 outline-none rounded-md text-gray-300 leading-relaxed focus:bg-black/50 transition-all duration-300"
            />
        </div>

        <div className={sectionStyles}>
            <label htmlFor="attachment" className={`${labelStyles} text-2xl text-gray-200 mb-4 block`}>Attachment</label>
            {writeup.attachment?.data ? (
              <div>
                <img src={writeup.attachment.data} alt={writeup.attachment.name} className="max-w-xs h-auto rounded-md border border-gray-700 mb-4" />
                <div className="flex items-center justify-between font-mono text-sm text-gray-400">
                    <span>{writeup.attachment.name}</span>
                    <button
                        onClick={handleRemoveAttachment}
                        className="text-red-500/70 hover:text-red-400 transition-colors"
                        aria-label="Remove attachment"
                    >
                        [REMOVE]
                    </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <input
                    type="file"
                    id="attachment"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Upload an attachment"
                />
                <div className="w-full p-8 border-2 border-dashed border-gray-700 hover:border-gray-500 transition-colors duration-300 text-center cursor-pointer flex flex-col items-center justify-center">
                    <p className="text-gray-400">Click or drag & drop a file</p>
                    <p className="text-xs text-gray-600 mt-1">Image files work best</p>
                </div>
              </div>
            )}
        </div>

        <div className={sectionStyles}>
            <label htmlFor="flag" className={`${labelStyles} text-2xl text-gray-200 mb-4 block`}>Flag</label>
            <input
                id="flag"
                name="flag"
                type="text"
                value={writeup.flag}
                onChange={handleInputChange}
                className={`${inputStyles} font-mono text-white`}
                placeholder="CTF{...}"
            />
        </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
            <button
                onClick={onBack}
                className="text-sm text-gray-300 border border-gray-500 px-4 py-2 hover:bg-gray-300 hover:text-black transition-all duration-300"
            >
                &lt;&lt; BACK TO LIST
            </button>
            {isAdmin && (
                <button
                    onClick={handleDelete}
                    className="font-mono text-sm border border-red-500/70 px-4 py-2 text-red-500/70 hover:bg-red-500 hover:text-black transition-all duration-300"
                >
                    DELETE WRITEUP
                </button>
            )}
        </div>
        {isAdmin ? <EditableView /> : <ReadOnlyView />}
    </div>
  )
};

export default WriteupDetail;
