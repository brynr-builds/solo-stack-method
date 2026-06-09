import { categories } from '../data';

interface FilterTabsProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export function FilterTabs({ selectedCategory, setSelectedCategory }: FilterTabsProps) {
  return (
    <section className="px-6 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-solo-accent text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
