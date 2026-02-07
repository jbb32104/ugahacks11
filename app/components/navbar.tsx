"use client";

import {useEffect, useState} from "react";
import Link from "next/link";

const NavBar = () => {
    //States and functions
    const [isLoggedIn,setLoggedIn] = useState(true);

    return (
        <header>
            <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <span className="text-lg font-bold tracking-tight"><Link href="./">Squirt Car</Link></span>
            {isLoggedIn ? (
                <div className = "flex justify-between gap-4">
                    <span>
                        Welcome user!
                    </span>
                    <button className = "rounded-full bg-white text-black" onClick={() =>{setLoggedIn(!isLoggedIn)}}>Logout</button>
                </div>
                ): (
                <Link href="../login"
                className="rounded-full bg-white border border-white/20 text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors">
                    Sign In
                </Link>
                )
        }
        </nav>
    </header>
    );
}
export default NavBar;