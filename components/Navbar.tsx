"use client";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import React from "react";

function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="relative z-50 bg-slate-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
              StreamMatch
            </span>
          </Link>

          {/* Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/Matches"
                className="text-gray-300 hover:text-pink-400 font-medium transition-colors"
              >
                Discover
              </Link>
              <Link
                href="/Matches/List"
                className="text-gray-300 hover:text-blue-400 font-medium transition-colors"
              >
                Matches
              </Link>
              <Link
                href="/chat"
                className="text-gray-300 hover:text-green-400 font-medium transition-colors"
              >
                Messages
              </Link>
              <Link
                href="/Profile"
                className="text-gray-300 hover:text-purple-400 font-medium transition-colors"
              >
                Profile
              </Link>
            </div>
          )}

          {/* Auth Button */}
          {user ? (
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition shadow"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          ) : (
            <Link
              href="/Auth"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm font-medium hover:from-pink-600 hover:to-red-600 transition shadow"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
