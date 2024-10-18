// App.tsx

import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useEffect, ReactNode } from "react";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./contexts/financial-record-context";
import { SignedIn, UserButton } from "@clerk/clerk-react";

// Adding types for props in RequireAuth
interface RequireAuthProps {
  children: ReactNode;
}

function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is signed in
    const isSignedIn = localStorage.getItem("signed") === "true"; // Use strict equality
    if (!isSignedIn) {
      navigate("/auth");
    }
  }, [navigate]);

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <Link to="/">Dashboard</Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <FinancialRecordsProvider>
                  <Dashboard />
                </FinancialRecordsProvider>
              </RequireAuth>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
