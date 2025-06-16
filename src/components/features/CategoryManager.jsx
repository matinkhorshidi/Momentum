import React, { useState } from 'react';
import { GripVertical, X, Edit, Check, Calendar, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import Card from '../ui/Card';
import ColorPicker from '../ui/ColorPicker';
import AddCategoryForm from './AddCategoryForm';
import { Popover } from '../ui/Popover'; // Import the single, corrected Popover component
import RoutineCreator from './RoutineCreator';

const CategoryManager = () => {
  const { userData, saveData } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const categories = userData?.settings?.categories || [];

  const handleCategoryChange = (id, field, value) => {
    const newCategories = categories.map((cat) =>
      cat.id === id ? { ...cat, [field]: value } : cat
    );
    saveData({
      ...userData,
      settings: { ...userData.settings, categories: newCategories },
    });
  };

  const handleDeleteCategory = (id) => {
    if (
      window.confirm('Are you sure? This will also delete its log entries.')
    ) {
      const newCategories = categories.filter((cat) => cat.id !== id);
      saveData({
        ...userData,
        settings: { ...userData.settings, categories: newCategories },
      });
    }
  };

  const handleRoutineChange = (id, newRoutine) => {
    handleCategoryChange(id, 'routine', newRoutine);
  };

  const handleRemoveRoutine = (id) => {
    const newCategories = categories.map((cat) => {
      if (cat.id === id) {
        const { routine, streak, ...rest } = cat;
        return rest;
      }
      return cat;
    });
    saveData({
      ...userData,
      settings: { ...userData.settings, categories: newCategories },
    });
  };

  // Drag and Drop logic
  const onDragStart = (e, index) => {
    e.dataTransfer.setData('draggedIndex', index);
    e.currentTarget.classList.add('opacity-50');
  };
  const onDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50');
  };
  const onDrop = (e, dropIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData('draggedIndex');
    const newCategories = [...categories];
    const [draggedItem] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedItem);
    saveData({
      ...userData,
      settings: { ...userData.settings, categories: newCategories },
    });
  };

  const EditButton = (
    <button
      onClick={() => setIsEditing(!isEditing)}
      className="flex items-center gap-2 text-sm text-secondary-text hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
    >
      {isEditing ? <Check size={16} /> : <Edit size={16} />}
      {isEditing ? 'Done' : 'Edit'}
    </button>
  );

  return (
    <Card title="Your Focus Areas" headerAction={EditButton}>
      <div
        className="flex flex-col gap-1 mb-4"
        onDragOver={(e) => e.preventDefault()}
      >
        <AnimatePresence>
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              draggable={isEditing}
              onDragStart={(e) => onDragStart(e, index)}
              onDragEnd={onDragEnd}
              onDrop={(e) => onDrop(e, index)}
              className="group flex items-center gap-3 p-2 rounded-lg"
            >
              <GripVertical
                size={20}
                className={`transition-opacity text-secondary-text ${
                  isEditing
                    ? 'cursor-grab active:cursor-grabbing'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              />

              <ColorPicker
                selectedColor={cat.color}
                onColorChange={(color) =>
                  handleCategoryChange(cat.id, 'color', color)
                }
              />

              {isEditing ? (
                <input
                  type="text"
                  value={cat.label}
                  onChange={(e) =>
                    handleCategoryChange(cat.id, 'label', e.target.value)
                  }
                  className="flex-grow p-2 border rounded text-base bg-input-bg border-input-border text-primary-text"
                />
              ) : (
                <span className="flex-grow text-primary-text text-left">
                  {cat.label}
                </span>
              )}

              <Popover
                placement="left-start"
                trigger={
                  <button
                    className={`p-1.5 rounded-full transition-colors ${
                      cat.routine
                        ? 'text-accent hover:bg-accent/20'
                        : 'text-secondary-text/60 hover:text-accent hover:bg-accent/20'
                    }`}
                  >
                    <Calendar size={16} />
                  </button>
                }
                content={
                  <RoutineCreator
                    category={cat}
                    onRoutineChange={(newRoutine) =>
                      handleRoutineChange(cat.id, newRoutine)
                    }
                    onRemove={() => handleRemoveRoutine(cat.id)}
                  />
                }
              />

              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className={`p-1.5 rounded-full transition-opacity text-secondary-text hover:text-error ${
                  isEditing
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showAddForm ? (
        <AddCategoryForm onCategoryAdded={() => setShowAddForm(false)} />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center gap-2 p-2 mt-2 text-secondary-text hover:text-primary-text transition-colors rounded-lg hover:bg-white/5"
        >
          <Plus size={16} /> Add new...
        </button>
      )}
    </Card>
  );
};

export default CategoryManager;
