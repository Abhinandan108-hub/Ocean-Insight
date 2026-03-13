import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const plans = [
  {
    name: "Free",
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "For students & hobbyists exploring ocean data.",
    features: [
      "50 AI queries/month",
      "Basic float search",
      "Temperature & salinity data",
      "Community support",
      "Export CSV",
    ],
    cta: "Get Started",
    popular: false,
    gradient: "from-muted-foreground/20 to-muted-foreground/5",
  },
  {
    name: "Pro",
    icon: Crown,
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: "For active researchers & oceanographers.",
    features: [
      "Unlimited AI queries",
      "All BGC-Argo parameters",
      "Advanced visualizations",
      "Priority support",
      "Export NetCDF & CSV",
      "Custom dashboards",
      "API access (5K req/mo)",
    ],
    cta: "Start Pro Trial",
    popular: true,
    gradient: "from-primary to-accent",
  },
  {
    name: "Enterprise",
    icon: Building2,
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: "For institutions & research teams.",
    features: [
      "Everything in Pro",
      "Unlimited API access",
      "Team collaboration",
      "Custom integrations",
      "SLA & dedicated support",
      "On-premise deployment",
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
    gradient: "from-violet-500/20 to-indigo-500/5",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [ref, visible] = useScrollReveal(0.15);

  return (
    <section id="pricing" ref={ref} className="py-20 sm:py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-5">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Start free and scale as your research grows. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-medium transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors cursor-pointer ${annual ? "bg-primary" : "bg-muted"}`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md"
                style={{ left: annual ? "calc(100% - 1.625rem)" : "0.125rem" }}
              />
            </motion.button>
            <span className={`text-sm font-medium transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual <span className="text-primary text-xs font-bold ml-1">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const price = annual ? plan.yearlyPrice : plan.monthlyPrice;
            const period = annual ? "/year" : "/month";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className={`relative rounded-2xl border p-6 sm:p-7 flex flex-col transition-shadow ${
                  plan.popular
                    ? "border-primary/40 bg-card shadow-glow-teal"
                    : "border-border bg-card hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    Most Popular
                  </span>
                )}

                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${plan.popular ? "text-primary-foreground" : "text-foreground"}`} />
                </div>

                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-5">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-foreground">
                    {price === 0 ? "Free" : `$${price}`}
                  </span>
                  {price > 0 && <span className="text-sm text-muted-foreground">{period}</span>}
                </div>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((feat, fi) => (
                    <motion.li
                      key={feat}
                      initial={{ opacity: 0, x: -10 }}
                      animate={visible ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + fi * 0.05 }}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {feat}
                    </motion.li>
                  ))}
                </ul>

                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all ${
                      plan.popular
                        ? "bg-primary text-primary-foreground shadow-glow-teal"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {plan.cta}
                  </motion.button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
