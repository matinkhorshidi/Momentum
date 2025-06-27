import React from 'react';
import { ShieldAlert, Hourglass } from 'lucide-react';
import Card from './Card'; // Assuming Card can be used as a modal base

const EditAttemptModal = ({ isOpen, onClose, attemptsLeft }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-bg-color/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-surface p-6 sm:p-8 rounded-2xl w-full max-w-md border border-border-default text-center animate-pop-in shadow-xl">
        <div className="flex justify-center mb-4">
          <ShieldAlert size={48} className="text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-primary-text mb-3">
          A Note on Your Legacy
        </h2>
        <p className="text-secondary-text mb-6">
          Your past victories are milestones, not editable documents. True
          momentum comes from what you do{' '}
          <strong className="text-accent">today</strong>. Are you sure you want
          to alter history?
        </p>
        <div className="bg-input-bg p-3 rounded-lg flex items-center justify-center gap-3 mb-6">
          <Hourglass size={18} className="text-secondary-text" />
          <p className="font-mono text-sm text-primary-text">
            You have {attemptsLeft} attempt(s) left to unlock the time machine.
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-accent text-bg-color font-medium py-2.5 rounded-lg transition-colors hover:bg-button-hover"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default EditAttemptModal;
