import React, { useState } from 'react';

interface LoginProps {
  onLogin: (success: boolean) => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin(true);
      } else {
        setError(data.error || 'Authentication failed. Incorrect password.');
        onLogin(false);
      }
    } catch (err) {
      console.error("API route error:", err);
      setError('An error occurred during authentication. Please try again.');
      onLogin(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-black border border-gray-700 p-8 rounded-lg shadow-lg w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
          aria-label="Close login"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-400 font-mono text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border-2 border-gray-700 focus:border-white focus:outline-none rounded-md px-3 py-2 text-white"
              autoFocus
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition-colors disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
