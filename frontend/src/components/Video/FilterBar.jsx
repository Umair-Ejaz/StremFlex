
const FilterBar = ({ selected, onSelect }) => {
  const categories = ['All', 'YouTube', 'Twitch', 'Local'];

  return (
    <div className="flex gap-2 overflow-x-auto pb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            selected === cat
              ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
              : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;