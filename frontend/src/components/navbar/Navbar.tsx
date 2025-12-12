"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Home, ListTodo, Shield, User, LogOut } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/auth?view=login");
    setIsDropdownOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-50">
      {/* Logo/App Icon */}
      <Link href="/" className="mb-6">
        <div className="w-10 h-10 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-lg hover:bg-navy-dark transition-colors">
          T
        </div>
      </Link>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-2">
        <Link
          href="/"
          className={`w-full aspect-square flex items-center justify-center rounded-lg transition-all duration-200 ${
            isActive("/")
              ? "bg-navy text-white"
              : "text-gray-700 hover:bg-gray-100 hover:text-navy"
          }`}
          title="Home"
        >
          <Home className="w-5 h-5" />
        </Link>

        <Link
          href="/tasks"
          className={`w-full aspect-square flex items-center justify-center rounded-lg transition-all duration-200 ${
            isActive("/tasks")
              ? "bg-navy text-white"
              : "text-gray-700 hover:bg-gray-100 hover:text-navy"
          }`}
          title="Tasks"
        >
          <ListTodo className="w-5 h-5" />
        </Link>

        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className={`w-full aspect-square flex items-center justify-center rounded-lg transition-all duration-200 ${
              isActive("/admin")
                ? "bg-red text-white"
                : "text-gray-700 hover:bg-red-50 hover:text-red"
            }`}
            title="Admin Panel"
          >
            <Shield className="w-5 h-5" />
          </Link>
        )}
      </nav>

      {/* User Section */}
      <div className="relative w-full px-2">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full aspect-square flex items-center justify-center rounded-lg transition-all duration-200 ${
            isDropdownOpen
              ? "bg-navy text-white"
              : "text-gray-700 hover:bg-gray-100 hover:text-navy"
          }`}
          title={user?.name || "User"}
        >
          {user ? (
            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-white font-semibold text-sm">
              {user.name?.charAt(0).toUpperCase() || "G"}
            </div>
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            ></div>
            <div className="absolute left-20 bottom-0 w-56 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
              {user && (
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-navy text-white">
                    {user.role === "ADMIN" ? "Admin" : "User"}
                  </span>
                </div>
              )}
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href={user ? "/" : "/auth?view=signup"}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                {user ? "Profile" : "Sign Up"}
              </Link>
              <hr className="my-2 border-gray-200" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red hover:bg-red-50 transition-colors font-medium text-left"
              >
                <LogOut className="w-4 h-4" />
                {user ? "Logout" : "Login"}
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
