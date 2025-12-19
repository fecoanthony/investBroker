import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Layers,
  Wallet,
  Users,
  TrendingUp,
} from "lucide-react";

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded ${
      isActive ? "bg-yellow-500 text-black" : "text-slate-300"
    }`;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800">
      <div className="p-4 font-bold text-xl">Admin Panel</div>

      <nav className="space-y-1">
        <NavLink to="/admin" className={linkClass}>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        <NavLink to="/admin/plans" className={linkClass}>
          <Layers size={18} /> Plans
        </NavLink>

        <NavLink to="/admin/investments" className={linkClass}>
          <TrendingUp size={18} /> Investments
        </NavLink>

        <NavLink to="/admin/transactions" className={linkClass}>
          <Wallet size={18} /> Transactions
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} /> Users
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
