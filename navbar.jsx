import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(){
    return (
    <nav className="bg-transparent px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Stock Portfolio Tracker</Link>
        <div className="space-x-4">
        <Link to="/dashboard" className="hover:text-indigo-300">Dashboard</Link>
        </div>
    </nav>
    )
}
