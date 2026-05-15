import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center border-b border-teal-900/30">
      <div className="text-2xl font-bold tracking-tight">
        Rehaby<span className="text-teal-500">AI</span>
      </div>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-teal-400 transition-colors">Patient</Link>
        <Link to="/clinician" className="hover:text-teal-400 transition-colors">Clinician</Link>
      </div>
    </nav>
  )
}
