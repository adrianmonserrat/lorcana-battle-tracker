
import React from 'react';

interface StatisticsLayoutProps {
  title: string;
  filter: React.ReactNode;
  children: React.ReactNode;
}

export function StatisticsLayout({ title, filter, children }: StatisticsLayoutProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      {filter}
      {children}
    </div>
  );
}
