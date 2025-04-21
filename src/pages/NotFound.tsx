
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border-2 border-[#014F86]/20">
        <h1 className="text-4xl font-bold text-[#012A4A] mb-4">404</h1>
        <p className="text-xl text-[#01497C] mb-4">Oops! Page not found</p>
        <a href="/" className="text-[#2A6F97] hover:text-[#014F86] underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
