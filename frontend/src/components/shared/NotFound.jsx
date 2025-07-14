import { Link, useLocation } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl transition-transform hover:scale-110">
          404
        </h1>
        <p className="text-gray-500">
          Looks like you've ventured into the unknown digital realm.
        </p>
        <Link
          to={"/"}
          className="inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
