
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { MainLayout } from "../components/layout/MainLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-primary">404</h1>
          <p className="text-xl mb-6">Oops! Page not found</p>
          <p className="text-muted-foreground mb-8">
            The page you are looking for might have been removed or is temporarily unavailable.
          </p>
          <Button asChild>
            <a href="/">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
