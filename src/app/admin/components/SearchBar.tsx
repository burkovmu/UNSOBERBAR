import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FilterType } from '@/types/menu';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white/90 placeholder-white/40 focus:outline-none focus:border-white/10 transition-colors pl-10"
          />
          <MagnifyingGlassIcon className="w-4 h-4 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <select
          value={filterType}
          onChange={(e) => onFilterChange(e.target.value as FilterType)}
          className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5 text-sm text-white/90 focus:outline-none focus:border-white/10 transition-colors appearance-none cursor-pointer hover:bg-white/[0.04]"
        >
          <option value="all">Все</option>
          <option value="categories">Категории</option>
          <option value="items">Блюда</option>
          <option value="hidden">Скрытые</option>
        </select>
      </div>
    </div>
  );
}; 