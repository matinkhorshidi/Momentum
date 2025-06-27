import React, { useState } from 'react';
import {
  GripVertical,
  Edit,
  Check,
  Calendar,
  Plus,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserProvider';
import Card from '../ui/Card';
import ColorPicker from '../ui/ColorPicker';
import AddCategoryForm from './AddCategoryForm';
import { Popover } from '../ui/Popover';
import RoutineCreator from './RoutineCreator';

const CategoryManager = () => {
  const { userData, saveData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const categories = userData?.settings?.categories || [];

  // --- All handler functions remain unchanged ---
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
        const { routine, ...rest } = cat;
        return rest;
      }
      return cat;
    });
    saveData({
      ...userData,
      settings: { ...userData.settings, categories: newCategories },
    });
  };
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
              className="group flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-white/5"
            >
              <GripVertical
                size={20}
                className={`transition-all text-secondary-text ${
                  isEditing
                    ? 'opacity-50 cursor-grab active:cursor-grabbing'
                    : 'opacity-0 -ml-5'
                }`}
              />
              <ColorPicker
                selectedColor={cat.color}
                onColorChange={(color) =>
                  handleCategoryChange(cat.id, 'color', color)
                }
                disabled={!isEditing}
              />

              {isEditing ? (
                <input
                  type="text"
                  value={cat.label}
                  onChange={(e) =>
                    handleCategoryChange(cat.id, 'label', e.target.value)
                  }
                  className="flex-grow p-2 border rounded-md text-base bg-input-bg border-input-border text-primary-text"
                />
              ) : (
                <span className="flex-grow text-primary-text text-left">
                  {cat.label}
                </span>
              )}

              <div className="flex items-center ml-auto">
                {isEditing ? (
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-full text-secondary-text hover:text-error hover:bg-error/10"
                  >
                    <Trash2 size={16} />
                  </button>
                ) : (
                  // --- NEW LOGIC: Calendar is always visible, "More" button appears on hover ---
                  <div className="flex items-center gap-1">
                    <Popover
                      placement="left-start"
                      trigger={
                        // This button is now always visible
                        <button
                          title="Set Routine"
                          className={`p-1.5 rounded-full transition-colors duration-200 ${
                            cat.routine
                              ? 'text-accent hover:bg-accent/20' // Active routine style
                              : 'text-secondary-text/40 hover:text-accent' // Inactive routine style
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
                    <Popover
                      placement="left-start"
                      trigger={
                        // This button is only visible on hover
                        <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-secondary-text/80 hover:bg-white/10 transition-opacity duration-200">
                          <MoreVertical size={16} />
                        </button>
                      }
                      content={
                        <div className="bg-surface border border-border-default rounded-lg p-2 flex flex-col items-start w-32">
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="w-full flex items-center gap-2 text-left p-2 rounded-md text-error/80 hover:bg-error/10 hover:text-error"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      }
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showAddForm ? (
        <AddCategoryForm onCategoryAdded={() => setShowAddForm(false)} />
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center gap-2 p-3 mt-2 text-secondary-text hover:text-primary-text transition-colors rounded-lg border-2 border-dashed border-white/10 hover:border-white/20 hover:bg-white/5"
        >
          <Plus size={16} /> Add new focus area
        </button>
      )}
    </Card>
  );
};

export default CategoryManager;
