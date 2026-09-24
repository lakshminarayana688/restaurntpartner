import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MenuItem, MenuCategory } from '../../types/menu';
import { VegIndicator } from '../../components/common/VegIndicator';
import { AddEditMenuItemModal } from './AddEditMenuItemModal';
import {
  Plus,
  Search,
  Edit2,
  Copy,
  Trash2,
  Star,
  Clock,
  Sparkles,
  Utensils,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const MenuScreen: React.FC = () => {
  const {
    menuItems,
    toggleItemAvailability,
    deleteMenuItem,
    duplicateMenuItem,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);

  const categories: MenuCategory[] = [
    'Biryani',
    'Starters',
    'Main Course',
    'Rice',
    'Breads',
    'Desserts',
    'Beverages',
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesDietary =
      dietaryFilter === 'ALL' || (dietaryFilter === 'VEG' ? item.isVeg : !item.isVeg);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDietary && matchesSearch;
  });

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Menu & Pricing Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live food catalog, toggle stock availability, and update pricing instantly.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="py-3 px-5 bg-gradient-to-r from-feedo-500 to-feedo-600 hover:from-feedo-600 hover:to-feedo-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-feedo-500/25 flex items-center gap-2 self-start sm:self-auto transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Menu Item</span>
        </button>
      </div>

      {/* Categories & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-4">
        {/* Search & Dietary Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes (e.g. Biryani, Butter Naan, Paneer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-feedo-500 focus:outline-hidden transition-all"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDietaryFilter('ALL')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                dietaryFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Items ({menuItems.length})
            </button>
            <button
              onClick={() => setDietaryFilter('VEG')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                dietaryFilter === 'VEG'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <VegIndicator isVeg={true} size="sm" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setDietaryFilter('NON_VEG')}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                dietaryFilter === 'NON_VEG'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              <VegIndicator isVeg={false} size="sm" />
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-feedo-500 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-feedo-500 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No menu items found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your filters or add a new dish.</p>
          <button
            onClick={handleAddNew}
            className="mt-4 px-4 py-2 bg-feedo-500 text-white text-xs font-bold rounded-xl shadow hover:bg-feedo-600 transition-colors"
          >
            + Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                item.isAvailable
                  ? 'border-slate-200 hover:border-feedo-300 shadow-2xs hover:shadow-md'
                  : 'border-slate-200 bg-slate-50/70 opacity-80'
              }`}
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-3 bg-slate-100 border border-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
                      !item.isAvailable ? 'grayscale' : ''
                    }`}
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <VegIndicator isVeg={item.isVeg} size="sm" />
                    {item.isBestSeller && (
                      <span className="text-[10px] font-black bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 fill-current" /> BESTSELLER
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.preparationTimeMinutes}m prep
                  </div>
                </div>

                {/* Title & Category */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{item.name}</h3>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md shrink-0">
                    {item.category}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Pricing & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black font-mono text-slate-900">
                      ₹{item.discountPrice || item.price}
                    </span>
                    {item.discountPrice && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ₹{item.price}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                    ★ {item.rating} <span className="text-[10px] text-slate-400">({item.votes})</span>
                  </span>
                </div>
              </div>

              {/* Card Footer: Stock Switch & Actions */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                {/* In-Stock Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Stock Availability</span>
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      item.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    {item.isAvailable ? '🟢 In Stock' : '🔴 Out of Stock'}
                  </button>
                </div>

                {/* Action Buttons: Edit, Duplicate, Delete */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-slate-500 hover:text-feedo-600 hover:bg-feedo-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => duplicateMenuItem(item.id)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Item Modal */}
      <AddEditMenuItemModal
        isOpen={isModalOpen}
        itemToEdit={itemToEdit}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
