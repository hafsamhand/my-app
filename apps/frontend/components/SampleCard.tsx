import React from 'react';

export default function SampleCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-bold mb-3 text-gray-800 border-b border-gray-200 pb-2">{title}</h3>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
