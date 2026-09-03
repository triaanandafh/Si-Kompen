'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'success',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
        {/* Icon Header */}
        <div
          className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
            type === 'success'
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-rose-100 text-rose-600'
          }`}
        >
          {type === 'success' ? (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        {/* Title & Message */}
        <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#0F388A] hover:bg-blue-900 text-white font-semibold rounded-xl text-sm transition-all"
        >
          Selesai
        </button>
      </div>
    </div>
  );
}