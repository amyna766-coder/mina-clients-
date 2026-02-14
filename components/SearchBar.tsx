
import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-sky-400 group-focus-within:text-sky-600 transition-colors" />
      </div>
      <input
        type="text"
        className="block w-full pr-11 pl-12 py-4 bg-sky-50 border border-sky-100 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-sky-900 font-medium placeholder:text-sky-300"
        placeholder="ابحث بالاسم أو رقم الصفحة..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 left-0 pl-4 flex items-center text-sky-400 hover:text-sky-600"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
