import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Directory from "./pages/Directory";
import Login from "./pages/Login";
import { useAuthStore } from "@/stores/authStore";
import Header from "./components/layout/Header";
import Profile from "./pages/profile/Profie";
import ProtectedRoute from "./components/ProtectedRoute";
const queryClient = new QueryClient();

// PublicRoute: Only renders children if not logged in, else redirects
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const userId = useAuthStore((state) => state.userId);
  if (userId) {
    return <Navigate to="/profile" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/directory" element={<Directory />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
