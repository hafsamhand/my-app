import React from 'react';

export default function SampleCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}
