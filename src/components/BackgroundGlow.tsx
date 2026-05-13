import React from 'react';

export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-teal-500/10 blur-[100px] rounded-full" />
      <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-purple-600/10 blur-[80px] rounded-full" />
    </div>
  );
}
