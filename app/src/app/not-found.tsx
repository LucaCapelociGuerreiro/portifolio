import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="mb-4">This page could not be found.</p>
      <Link 
        href="/"
        className="text-blue-600 hover:underline"
      >
        Return Home
      </Link>
    </div>
  );
}