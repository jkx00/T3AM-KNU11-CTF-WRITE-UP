
import React, { useState, useEffect } from 'react';
import GlitchText from './components/GlitchText';
import WriteupCard from './components/WriteupCard';
import WriteupDetail from './components/WriteupDetail';
import Login from './components/Login';
import { WRITEUPS_DATA } from './constants';
import type { Writeup, WriteupCategory, WriteupDifficulty } from './types';

interface HeaderProps {
    isAdmin: boolean;
    onLogoutClick: () => void;
}

interface FooterProps {
    onCopyrightClick: () => void;
}

// Helper function outside the component to validate and load writeups from localStorage
const isValidWriteups = (data: any): data is Writeup[] => {
  const validCategories: WriteupCategory[] = ['Web', 'Crypto', 'Pwn', 'Reverse Engineering', 'Forensics', 'Misc', 'OSINT', 'Steganography', 'Mobile', 'Blockchain'];
  const validDifficulties: WriteupDifficulty[] = ['Easy', 'Medium', 'Hard', 'Insane'];
  return Array.isArray(data) && data.every(item =>
    typeof item === 'object' && item !== null &&
    'id' in item && 'title' in item &&
    'category' in item && validCategories.includes(item.category) &&
    'difficulty' in item && validDifficulties.includes(item.difficulty)
  );
};

const loadWriteups = (): Writeup[] => {
  try {
    const savedWriteupsRaw = localStorage.getItem('ctf-writeups');
    if (savedWriteupsRaw) {
      const savedWriteups = JSON.parse(savedWriteupsRaw);
      if (isValidWriteups(savedWriteups)) {
        return savedWriteups;
      }
      console.warn("localStorage data is malformed. Using default data.");
      localStorage.removeItem('ctf-writeups');
    }
  } catch (error) {
    console.error("Failed to load or parse writeups from localStorage", error);
  }
  return WRITEUPS_DATA; // Fallback to default
};


const Header: React.FC<HeaderProps> = ({ isAdmin, onLogoutClick }) => (
  <header className="py-8 px-4 text-center border-b-2 border-gray-800 relative">
    <GlitchText text="T3AM KNU11 CTF" />
    <p className="mt-4 text-gray-400 font-mono">// A collection of cybersecurity exploits and chronicles</p>
    <div className="absolute top-4 right-4">
        {isAdmin && (
            <button onClick={onLogoutClick} className="font-mono text-sm border border-gray-600 px-3 py-1 text-gray-400 hover:bg-gray-200 hover:text-black transition-colors">
                LOGOUT
            </button>
        )}
    </div>
  </header>
);

const Footer: React.FC<FooterProps> = ({ onCopyrightClick }) => (
  <footer className="py-6 px-4 text-center border-t-2 border-gray-800 mt-12">
    <p className="text-gray-500 font-mono text-sm">
      <span 
        onClick={onCopyrightClick} 
        className="cursor-pointer select-none" 
        title="Admin Access"
      >
        &copy;
      </span> {new Date().getFullYear()} T3AM KNU11 // All rights reserved. Disconnecting from host...
    </p>
  </footer>
);


const App: React.FC = () => {
  const [writeups, setWriteups] = useState<Writeup[]>(loadWriteups);
  const [selectedWriteup, setSelectedWriteup] = useState<Writeup | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Check session storage for existing admin session
    try {
        const loggedIn = sessionStorage.getItem('isAdmin') === 'true';
        if (loggedIn) {
            setIsAdmin(true);
        }
    } catch (error) {
        console.error("Failed to read admin status from sessionStorage", error);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return; // Only save if admin
    try {
      localStorage.setItem('ctf-writeups', JSON.stringify(writeups));
    } catch (error) {
      console.error("Failed to save writeups to localStorage", error);
    }
  }, [writeups, isAdmin]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedWriteup]);

  const handleUpdateWriteup = (updatedWriteup: Writeup) => {
    if (!isAdmin) return;
    const updatedWriteups = writeups.map(w => w.id === updatedWriteup.id ? updatedWriteup : w);
    setWriteups(updatedWriteups);
    if (selectedWriteup && selectedWriteup.id === updatedWriteup.id) {
        setSelectedWriteup(updatedWriteup);
    }
  };

  const handleSelectWriteup = (writeup: Writeup) => {
    setIsFadingOut(true);
    setTimeout(() => {
        setSelectedWriteup(writeup);
        setIsFadingOut(false);
    }, 300);
  };

  const handleBack = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setSelectedWriteup(null);
      setIsFadingOut(false);
    }, 300);
  };

  const handleLogin = (success: boolean) => {
    if (success) {
        setIsAdmin(true);
        sessionStorage.setItem('isAdmin', 'true');
        setShowLogin(false);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };

  const handleCreateWriteup = () => {
    const newWriteup: Writeup = {
      id: Date.now(), // Simple unique ID
      title: "New Writeup Title",
      category: "Web",
      difficulty: "Easy",
      description: "Start writing your description here.",
      solution: "<h2>Start your solution here...</h2>",
      flag: "CTF{}",
      author: "Admin"
    };
    const newWriteups = [newWriteup, ...writeups];
    setWriteups(newWriteups);
    handleSelectWriteup(newWriteup);
  };

  const handleDeleteWriteup = (id: number) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this writeup? This action is permanent.')) {
        setWriteups(prevWriteups => prevWriteups.filter(w => w.id !== id));
        // If the deleted writeup was the selected one, go back to the list.
        if (selectedWriteup && selectedWriteup.id === id) {
            handleBack();
        }
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col">
      {showLogin && <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      <Header isAdmin={isAdmin} onLogoutClick={handleLogout} />
      <main className={`container mx-auto px-4 py-8 md:py-12 flex-grow transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        {selectedWriteup ? (
          <WriteupDetail 
            writeup={selectedWriteup} 
            onBack={handleBack} 
            onUpdate={handleUpdateWriteup} 
            isAdmin={isAdmin}
            onDelete={handleDeleteWriteup}
          />
        ) : (
          <>
            {isAdmin && (
              <div className="mb-8 text-right">
                <button
                  onClick={handleCreateWriteup}
                  className="font-mono text-sm border border-gray-500 px-4 py-2 text-gray-300 hover:bg-gray-300 hover:text-black transition-all duration-300"
                >
                  + CREATE NEW WRITEUP
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {writeups.map((writeup) => (
                <WriteupCard
                  key={writeup.id}
                  writeup={writeup}
                  onSelect={handleSelectWriteup}
                  isAdmin={isAdmin}
                  onDelete={handleDeleteWriteup}
                />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer onCopyrightClick={() => setShowLogin(true)} />
    </div>
  );
};

export default App;
