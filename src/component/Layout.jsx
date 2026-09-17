import { Outlet } from "react-router-dom";
import bgImage from '../assets/bg.jpg';

export default function Layout() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* You can also put a persistent Navbar here */}

      <main className="flex-1 p-6">
        {/* Outlet automatically renders whichever child route is active */}
        <Outlet />
      </main>

      {/* You can also put a persistent Footer here */}
    </div>
  );
}
