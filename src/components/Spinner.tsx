"use client";

import React from "react";

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label }: SpinnerProps) {
  return (
    <div className="flex items-center gap-2.5 text-gray-400 text-sm">
      <div className="w-4 h-4 border-2 border-[#232D40] border-t-indigo-500 rounded-full animate-spin" />
      {label && <span>{label}</span>}
    </div>
  );
}
