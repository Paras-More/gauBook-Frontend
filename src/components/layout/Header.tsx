import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {/* <span className="text-2xl">🐄</span>
          <span className="text-2xl font-heading font-bold text-gradient-saffron">
            GauBook
          </span> */}
          <img
            src={"/assests/gauBookLogoDark.png"}
            alt="GauBook Logo"
            className="h-full max-h-12 w-auto object-contain"
            style={{ display: "block" }}
            aria-hidden="true"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/directory"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Directory
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {(() => {
            const userId = useAuthStore((state) => state.userId);
            const userName = useAuthStore((state) => state.userName);
            if (userId) {
              return (
                <Link to="/profile">
                  <Avatar className="w-8 h-8 border border-border">
                    <AvatarFallback className="bg-gradient-to-br from-primary/80 to-secondary/80 text-primary-foreground font-bold">
                      {userName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              );
            }
            return (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Login
                </Button>
              </Link>
            );
          })()}
          <Link to="/register">
            <Button
              size="sm"
              className="gradient-saffron text-primary-foreground shadow-warm hover:opacity-90 transition-opacity"
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
