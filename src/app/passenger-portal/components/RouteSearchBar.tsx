'use client';

import Icon from '@/components/ui/AppIcon';
import React, { useState } from 'react';

interface RouteSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const RouteSearchBar = ({ onSearch, placeholder = "Search routes, destinations, or bus numbers..." }: RouteSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="input pl-12 pr-12 w-full h-12 text-base"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon name="MagnifyingGlassIcon" size={20} className="text-text-secondary" />
          </div>
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-muted rounded-r-md transition-colors duration-200"
            >
              <Icon name="XMarkIcon" size={20} className="text-text-secondary hover:text-foreground" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="mt-3 w-full sm:w-auto sm:absolute sm:right-2 sm:top-2 sm:mt-0 btn-primary px-6 py-2 rounded-md text-sm font-medium"
        >
          Search Routes
        </button>
      </form>
    </div>
  );
};

export default RouteSearchBar;