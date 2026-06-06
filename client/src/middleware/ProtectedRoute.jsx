import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchUser } from "../api/userApi";
import DirectoryView from "../DirectoryView";
import WelcomePage from "../components/WelcomePage";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const getUser = await fetchUser();

      if (getUser) {
        setUser(getUser);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return user ? <DirectoryView /> : <WelcomePage />;
}

export default ProtectedRoute;
