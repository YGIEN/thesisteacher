"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) return null;

  return (
    <nav className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50 backdrop-blur-sm bg-base-100/90">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl font-bold gap-0">
          <span className="text-primary">Thesis</span>
          <span>Teacher</span>
        </Link>
      </div>
      <div className="navbar-end gap-2">
        {session ? (
          <>
            <Link href="/dashboard" className="btn btn-ghost btn-sm">
              Dashboard
            </Link>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder"
              >
                <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                  {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="menu-header px-4 py-2 text-sm opacity-60">
                  {session.user.email}
                </li>
                <li>
                  <Link href="/dashboard">My Papers</Link>
                </li>
                <li>
                  <Link href="/papers/new">Upload New</Link>
                </li>
                <div className="divider my-1" />
                <li>
                  <button onClick={() => signOut()} className="text-error">
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn btn-primary btn-sm text-white"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}