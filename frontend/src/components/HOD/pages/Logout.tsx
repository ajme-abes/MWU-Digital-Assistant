
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate logout process
    const timer = setTimeout(() => {
      // In a real app, you'd clear authentication state here
      navigate("/");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
        <h1 className="text-2xl font-semibold">Logging out...</h1>
        <p className="text-muted-foreground">Please wait while we securely log you out.</p>
      </div>
    </div>
  );
}
