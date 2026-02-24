import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🐄</span>
          <span className="text-2xl font-heading font-bold text-gradient-saffron">
            GauBook
          </span>
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
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Login
            </Button>
          </Link>
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
