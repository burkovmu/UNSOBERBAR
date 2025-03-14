import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface BreadcrumbsProps {
  items: Array<{id: string; name: string; categoryId?: string}>;
  onNavigate: (index: number) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <div className="flex items-center flex-wrap gap-1 md:gap-2 mb-4 md:mb-6 text-xs md:text-sm">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center">
          {index > 0 && (
            <ChevronRightIcon className="w-3 h-3 md:w-4 md:h-4 text-white/20 mx-1 md:mx-2" />
          )}
          <button
            onClick={() => onNavigate(index)}
            className={`truncate max-w-[120px] md:max-w-none ${
              index === items.length - 1
                ? 'text-white font-medium'
                : 'text-white/60 hover:text-white/90'
            } transition-colors`}
          >
            {item.name}
          </button>
        </div>
      ))}
    </div>
  );
}; 