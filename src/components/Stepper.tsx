"use client";

import React from "react";

interface StepperProps {
  step: number;
}

const steps = ["Produto", "Mercado", "Presell", "Anuncios", "Campanha"];

export function Stepper({ step }: StepperProps) {
  return (
    <div className="flex gap-1 mb-6 flex-wrap">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;

        return (
          <div
            key={label}
            className="flex items-center gap-1.5 flex-1 min-w-[60px]"
          >
            <div
              className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0
                ${
                  done
                    ? "bg-green-500 text-white border-green-500"
                    : active
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-[#1A2333] text-gray-400 border-[#232D40]"
                }
                border
              `}
            >
              {done ? "✓" : n}
            </div>
            <span
              className={`text-xs font-bold whitespace-nowrap ${
                active ? "text-gray-100" : "text-gray-400"
              }`}
            >
              {label}
            </span>
            {n < steps.length && (
              <div className="flex-1 h-px bg-[#232D40] min-w-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
