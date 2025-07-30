import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", to: "/profile", isExternal: false },
      { label: "Projects", to: "/projects", isExternal: false },
    ],
  },
  {
    title: "Support",
    links: [
      {
        label: "Contact Us",
        to: "mailto:info.aquibjawed@gmail.com",
        isExternal: true,
      },
      {
        label: "Documentation",
        to: "https://github.com/aquibjawedio/planocean",
        isExternal: true,
      },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-border mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3 text-sm text-muted-foreground">
        <div className="space-y-3">
          <Link to="/" className="text-lg font-semibold text-foreground">
            PlanOcean
          </Link>
          <p className="text-sm text-muted-foreground">
            The ocean of planning and productivity. Organize your work, your
            team, and your goals — beautifully.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-foreground font-medium mb-2">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.links.map((link) =>
                  link.isExternal ? (
                    <li key={link.label}>
                      <a
                        href={link.to}
                        className="hover:text-foreground"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>

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
              Aquib Jawed
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
