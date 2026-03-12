import { Waves, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  Product: ["Features", "Dashboard", "API Access", "Changelog", "Roadmap"],
  Resources: ["Documentation", "ARGO Data Guide", "Research Papers", "Blog", "Status"],
  Company: ["About", "Team", "Careers", "Press", "Contact"],
};

export default function Footer() {
  return (
    <footer className="bg-background border-t border-ocean-border">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-teal flex items-center justify-center shadow-teal">
                <Waves className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Float<span className="text-gradient">Chat</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-5 max-w-[240px]">
              AI-powered ocean intelligence platform for researchers, oceanographers, and climate scientists.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "#", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-ocean-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-200 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-5">
                {group}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400 }}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer inline-block"
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* System Status Bar */}
        <div className="mb-8 p-4 rounded-xl border border-ocean-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs font-bold text-foreground uppercase tracking-widest">System Status</p>
            <div className="flex flex-wrap items-center gap-6">
              {[
                { label: "API", status: "Operational", ok: true },
                { label: "Data Network", status: "99.9% Up", ok: true },
                { label: "AI Engine", status: "Operational", ok: true },
                { label: "CDN", status: "Healthy", ok: true },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    {s.ok && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${s.ok ? "bg-emerald-400" : "bg-red-400"}`} />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{s.label}:</span> {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ocean-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FloatChat. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ y: -1 }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {link}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
