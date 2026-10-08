import { useState, useEffect } from 'react';
import { api } from '../api';
import { Key, Trash2, Plus, Copy, Check, AlertCircle } from 'lucide-react';
import { getModalClasses } from '../utils/themeConfig';

export default function ApiKeyManager({ onClose, theme }) {
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyGeneratedKey, setNewlyGeneratedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const data = await api.getKeys();
      setKeys(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    
    try {
      const data = await api.generateKey(newKeyName);
      setNewlyGeneratedKey(data.rawKey);
      setNewKeyName('');
      fetchKeys();
    } catch (err) {
      setError(err.message || 'Failed to generate key');
    }
  };

  const handleRevoke = async (id) => {
    try {
      await api.revokeKey(id);
      setKeys(keys.filter(k => k._id !== id));
      if (newlyGeneratedKey && keys.find(k => k._id === id)) {
        // If they revoke the key they just generated
        setNewlyGeneratedKey(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to revoke key');
    }
  };

  const copyToClipboard = () => {
    if (newlyGeneratedKey) {
      navigator.clipboard.writeText(newlyGeneratedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const modalClasses = getModalClasses(theme);

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center animate-in fade-in duration-200 ${modalClasses.overlay}`}>
      <div className={`m-4 max-w-2xl w-full max-h-[90vh] flex flex-col transform transition-all scale-in-100 ${modalClasses.container}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Key className={`w-6 h-6 ${theme === 'retro' ? 'text-black' : 'text-[var(--os-accent)] dark:text-gray-200'}`} />
            <h2 className={`${modalClasses.title} !mb-0`}>API Keys</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-2xl leading-none font-bold p-2"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2 text-sm border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* New Key Display */}
        {newlyGeneratedKey && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <h3 className="text-green-800 dark:text-green-400 font-bold mb-2 flex items-center gap-2">
              <Check className="w-5 h-5" /> Key Generated Successfully!
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3 font-medium">
              Please copy this key now. For security reasons, you will not be able to see it again.
            </p>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={newlyGeneratedKey}
                className="flex-1 bg-white dark:bg-black/40 border border-green-300 dark:border-green-700 rounded-lg px-3 py-2 text-sm font-mono text-gray-800 dark:text-gray-200 outline-none"
              />
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Create Key Form */}
        <form onSubmit={handleGenerate} className="flex gap-2 mb-6">
          <input 
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key Name (e.g., Kiko Assistant)"
            className={`${modalClasses.input} !mb-0`}
            maxLength={50}
          />
          <button 
            type="submit"
            disabled={!newKeyName.trim()}
            className={`${modalClasses.buttonPrimary} flex items-center gap-2 whitespace-nowrap disabled:opacity-50`}
          >
            <Plus className="w-4 h-4" /> Generate
          </button>
        </form>

        {/* Keys List */}
        <div className="flex-1 overflow-y-auto min-h-[200px] border border-gray-200 dark:border-gray-700/50 rounded-xl bg-gray-50/50 dark:bg-black/20 p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full text-gray-500">Loading keys...</div>
          ) : keys.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500 text-sm">No API keys found.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {keys.map(key => (
                <div key={key._id} className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1a2e] rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{key.name}</h4>
                    <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                      <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                      <span>Last used: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(key._id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Revoke Key"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
