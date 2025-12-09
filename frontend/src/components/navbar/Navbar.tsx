"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth?view=login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <h2 className="text-2xl font-bold text-navy-dark group-hover:text-navy transition-colors">
              Todo
            </h2>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className="text-gray-700 hover:text-navy px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              href="/todo"
              className="text-gray-700 hover:text-navy px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50"
            >
              Todo
            </Link>
            {user?.isAdmin && (
              <Link
                href="/admin"
                className="text-red hover:text-red-dark px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 hover:bg-red-50"
              >
                Admin Panel
              </Link>
            )}

            {/* User Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-navy hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navy transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "G"}
                </div>
                <span className="hidden lg:block text-sm font-medium">
                  {user?.name || "Guest"}
                </span>
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200 animate-scale-in">
                    {user && (
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.email}
                        </p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-navy text-white">
                          {user.role === "ADMIN" ? "Admin" : "User"}
                        </span>
                      </div>
                    )}
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={user ? "/" : "/auth?view=signup"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      {user ? "Profile" : "Sign Up"}
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <Link
                      href="/auth?view=login"
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-red hover:bg-red-50 transition-colors font-medium"
                    >
                      {user ? "Logout" : "Login"}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg border border-gray-200">
              <Link
                href="/"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-navy hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/todo"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-navy hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Todo
              </Link>
              {user?.isAdmin && (
                <Link
                  href="/admin"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-red hover:text-red-dark hover:bg-red-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {user && (
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.isAdmin ? "Admin" : "User"}
                    </p>
                  </div>
                )}
                <Link
                  href="/"
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-navy hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href={user ? "/" : "/auth?view=signup"}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-navy hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {user ? "Profile" : "Sign Up"}
                </Link>
                <Link
                  href="/auth?view=login"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-red hover:text-red-dark hover:bg-red-50 transition-colors"
                >
                  {user ? "Logout" : "Login"}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
