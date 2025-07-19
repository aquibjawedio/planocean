import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3 text-sm text-muted-foreground">
        {/* Branding */}
        <div className="space-y-3">
          <Link to="/" className="text-lg font-semibold text-foreground">
            PlanOcean
          </Link>
          <p className="text-sm text-muted-foreground">
            The ocean of planning and productivity. Organize your work, your
            team, and your goals — beautifully.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-foreground font-medium mb-2">Product</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/profile" className="hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-foreground">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/tasks" className="hover:text-foreground">
                  Tasks
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-medium mb-2">Support</h4>
            <ul className="space-y-1">
              <li>
                <a
                  href="mailto:support@planocean.io"
                  className="hover:text-foreground"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex gap-4">
            <a
              href="https://github.com/aquibjawedio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/aquibjawedio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/aquibjawedio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PlanOcean. Built with ❤️ by{" "}
            <a
              href="https://github.com/aquibjawedio"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              aquibjawedio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
