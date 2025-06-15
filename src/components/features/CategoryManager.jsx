import React, { useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { COLOR_PALETTE } from '../../utils/constants';
import Card from '../ui/Card';
import ColorPicker from '../ui/ColorPicker';

const CategoryManager = () => {
  const { userData, saveData } = useAppContext();
  const [newLabel, setNewLabel] = useState('');
  const [newColor, setNewColor] = useState(COLOR_PALETTE.Vibrant[0]);
  const categories = userData?.settings?.categories || [];

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newLabel.trim()) {
      const newCategory = {
        id: `custom_${Date.now()}`,
        label: newLabel.trim(),
        color: newColor,
      };
      const newCategories = [...categories, newCategory];
      saveData({
        ...userData,
        settings: { ...userData.settings, categories: newCategories },
      });
      setNewLabel('');
      setNewColor(COLOR_PALETTE.Vibrant[0]);
    }
  };

  const handleUpdateCategory = (id, field, value) => {
    const newCategories = categories.map((cat) =>
      cat.id === id ? { ...cat, [field]: value } : cat
    );
    saveData({
      ...userData,
      settings: { ...userData.settings, categories: newCategories },
    });
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const newCategories = categories.filter((cat) => cat.id !== id);
      saveData({
        ...userData,
        settings: { ...userData.settings, categories: newCategories },
      });
    }
  };

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('draggedIndex', index);
    e.currentTarget.classList.add('opacity-50');
  };

  const onDragEnd = (e) => e.currentTarget.classList.remove('opacity-50');

  const onDrop = (e, dropIndex) => {
    const draggedIndex = e.dataTransfer.getData('draggedIndex');
    const newCategories = [...categories];
    const [draggedItem] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedItem);
    saveData({
      ...userData,
      settings: { ...userData.settings, categories: newCategories },
    });
  };

  return (
    <Card
      title="Your Focus Areas"
      description="Drag 'em, drop 'em, change their colors. This is your command center."
    >
      <div
        className="flex flex-col gap-2 mb-6"
        onDragOver={(e) => e.preventDefault()}
      >
        {categories.map((cat, index) => (
          <div
            key={cat.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDrop={(e) => onDrop(e, index)}
            className="flex items-center gap-3 p-2 rounded-lg bg-[#2a2a2a] transition-opacity"
          >
            <GripVertical
              size={20}
              className="cursor-grab active:cursor-grabbing text-secondary-text"
            />
            <ColorPicker
              selectedColor={cat.color}
              onColorChange={(color) =>
                handleUpdateCategory(cat.id, 'color', color)
              }
            />
            <input
              type="text"
              value={cat.label}
              onChange={(e) =>
                handleUpdateCategory(cat.id, 'label', e.target.value)
              }
              className="flex-grow p-2 border rounded text-base bg-input-bg border-input-border text-primary-text"
            />
            <button
              onClick={() => handleDeleteCategory(cat.id)}
              className="bg-[#333] text-secondary-text rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors hover:bg-error hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleAddCategory}
        className="flex items-center gap-3 mt-6 p-2 border border-dashed border-border-default rounded-lg"
      >
        <ColorPicker selectedColor={newColor} onColorChange={setNewColor} />
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add a new focus area..."
          required
          className="flex-grow bg-transparent border-none text-base focus:outline-none p-1 text-primary-text"
        />
        <button
          type="submit"
          className="px-4 py-2 font-medium rounded-md transition-colors bg-accent text-bg-color hover:bg-button-hover"
        >
          Add
        </button>
      </form>
    </Card>
  );
};

export default CategoryManager;
