import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import MomentumLogo from '../ui/MomentumLogo';
import {
  Code2,
  BookOpen,
  Palette,
  Briefcase,
  Feather,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

const TEMPLATES = {
  Developer: {
    icon: <Code2 className="w-6 h-6 text-secondary-text" />,
    description: 'Coding, Code Review, Docs',
    categories: [
      { id: 'coding', label: 'Coding', color: '#ef4444' },
      { id: 'code-review', label: 'Code Review', color: '#f97316' },
      { id: 'docs', label: 'Documentation', color: '#ec4899' },
    ],
  },
  Student: {
    icon: <BookOpen className="w-6 h-6 text-secondary-text" />,
    description: 'Study, Research, Assignments',
    categories: [
      { id: 'study', label: 'Study', color: '#3b82f6' },
      { id: 'research', label: 'Research', color: '#8b5cf6' },
      { id: 'assignment', label: 'Assignment', color: '#10b981' },
    ],
  },
  Designer: {
    icon: <Palette className="w-6 h-6 text-secondary-text" />,
    description: 'UI Design, UX Research, Prototyping',
    categories: [
      { id: 'ui-design', label: 'UI Design', color: '#14b8a6' },
      { id: 'ux-research', label: 'UX Research', color: '#84cc16' },
      { id: 'prototyping', label: 'Prototyping', color: '#f59e0b' },
    ],
  },
  Manager: {
    icon: <Briefcase className="w-6 h-6 text-secondary-text" />,
    description: 'Meetings, Planning, 1-on-1s',
    categories: [
      { id: 'meetings', label: 'Meetings', color: '#6366f1' },
      { id: 'planning', label: 'Planning', color: '#a855f7' },
      { id: 'one-on-ones', label: '1-on-1s', color: '#d946ef' },
    ],
  },
  Writer: {
    icon: <Feather className="w-6 h-6 text-secondary-text" />,
    description: 'Writing, Editing, Brainstorming',
    categories: [
      { id: 'writing', label: 'Writing', color: '#0ea5e9' },
      { id: 'editing', label: 'Editing', color: '#64748b' },
      { id: 'brainstorming', label: 'Brainstorming', color: '#78716c' },
    ],
  },
  Freelancer: {
    icon: <Laptop className="w-6 h-6 text-secondary-text" />,
    description: 'Client Work, Admin, Marketing',
    categories: [
      { id: 'client-work', label: 'Client Work', color: '#22c55e' },
      { id: 'admin', label: 'Admin', color: '#f43f5e' },
      { id: 'marketing', label: 'Marketing', color: '#eab308' },
    ],
  },
};

const FirstTimeSetupModal = () => {
  const { userData, saveData, completeOnboarding } = useAppContext();
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  const toggleTemplate = (templateName) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateName)
        ? prev.filter((t) => t !== templateName)
        : [...prev, templateName]
    );
  };

  const handleFinishSetup = () => {
    if (!userData) return;

    const templateCategories = selectedTemplates.flatMap(
      (template) => TEMPLATES[template].categories
    );

    const newUserData = {
      ...userData,
      settings: {
        ...userData.settings,
        // We start with a clean slate, so no need to merge with existing.
        categories: [...templateCategories],
      },
    };

    saveData(newUserData);
    completeOnboarding();
  };

  return (
    <div className="fixed inset-0 bg-bg-color/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-surface p-6 sm:p-8 rounded-2xl w-full max-w-2xl border border-border-default text-left animate-fade-in-up shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <MomentumLogo className="text-accent h-6 w-6" />
          <h1 className="text-primary-text text-xl font-semibold">
            Choose your role
          </h1>
        </div>
        <p className="text-secondary-text text-sm mb-6">
          Pick one or more roles to pre-fill your focus areas.
        </p>

        {/* Mosaic-style selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {Object.entries(TEMPLATES).map(([name, { icon, description }]) => {
            const isSelected = selectedTemplates.includes(name);
            return (
              <button
                key={name}
                onClick={() => toggleTemplate(name)}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-200 group hover:scale-[1.015]
              ${
                isSelected
                  ? 'bg-accent/10 border-accent'
                  : 'bg-input-bg border-border-default hover:border-gray-500'
              }`}
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-primary-text font-medium">{name}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-accent ml-auto" />
                  )}
                </div>
                <p className="text-sm text-secondary-text">{description}</p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleFinishSetup}
            className="w-full py-3 rounded-lg font-medium text-base cursor-pointer transition-colors bg-accent text-bg-color hover:bg-button-hover"
          >
            {selectedTemplates.length > 0
              ? `Continue with ${selectedTemplates.length} role(s)`
              : 'Continue'}
          </button>
          <button
            onClick={handleFinishSetup}
            className="text-secondary-text hover:text-primary-text text-sm font-medium transition-colors"
          >
            I'll start from scratch
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeSetupModal;
