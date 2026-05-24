import { FileText, MessageSquare, Target, Sparkles, BarChart3, Users, LogOut, User, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Privacy from "./pages/Privacy";
// import Terms from "./pages/Terms";
// import Contact from "./pages/Contact";


const Navbar = () => {
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="font-display text-xl tracking-tight text-foreground">
          HireIQ
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/dsa" className="text-sm text-muted-foreground hover:text-foreground transition-colors">DSA</Link>
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
          {/* <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a> */}
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {userProfile?.displayName?.charAt(0)?.toUpperCase() ||
                       user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {userProfile?.displayName || user.email}
                    </p>
                    {userProfile?.displayName && (
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                {userProfile?.interviewStats && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1">
                      <p className="text-xs text-muted-foreground">
                        {userProfile.interviewStats.totalInterviews} interviews completed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Avg score: {userProfile.interviewStats.averageScore}/100
                      </p>
                    </div>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dsa" className="flex items-center">
                    <Code2 className="mr-2 h-4 w-4" />
                    <span>DSA Practice</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/auth">
                <Button variant="default" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const Hero = () => (
  <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.08),transparent_60%)]" />
    <div className="container mx-auto px-6 relative">
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <span className="inline-block text-sm font-medium text-accent tracking-wide uppercase mb-6">
            AI-Powered Career Tools
          </span>
        </div>
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-display leading-[0.95] tracking-tight mb-6 animate-fade-up"
          style={{ animationDelay: "100ms", opacity: 0 }}
        >
          Land your next role with{" "}
          <span className="text-gradient">confidence</span>
        </h1>
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 animate-fade-up"
          style={{ animationDelay: "200ms", opacity: 0 }}
        >
          Upload your resume, practice with AI interviewers, and get
          actionable feedback — all in one place.
        </p>
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "300ms", opacity: 0 }}
        >
          
          <Button variant="hero" size="lg" className="text-base px-8 py-6 rounded-xl" asChild>
            <Link to="/resume-analyzer">Analyze My Resume</Link>
          </Button>
          <Button variant="hero-outline" size="lg" className="text-base px-8 py-6 rounded-xl" asChild>
            <Link to="/mock-interview">Try Mock Interview</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {/* <div
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-up"
        style={{ animationDelay: "450ms", opacity: 0 }}
      >
        {[
          { value: "12,847", label: "Resumes analyzed" },
          { value: "93%", label: "Interview pass rate" },
          { value: "4.8★", label: "User rating" },
          { value: "38s", label: "Avg. feedback time" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl md:text-3xl font-display text-foreground tabular-nums">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div> */}
    </div>
  </section>
);

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Get line-by-line feedback on phrasing, impact, and ATS compatibility within seconds.",
  },
  {
    icon: MessageSquare,
    title: "Mock Interviews",
    description: "Practice with an AI interviewer tailored to your target role and company culture.",
  },
  {
    icon: Code2,
    title: "DSA Practice",
    description: "Master data structures and algorithms with curated LeetCode problems organized by pattern.",
  },
  {
    icon: Target,
    title: "Skill Gap Mapping",
    description: "See exactly which skills you're missing for your dream role and how to close the gap.",
  },
  {
    icon: Sparkles,
    title: "AI Rewrite Suggestions",
    description: "One-click rewrites to make your bullet points more compelling and quantified.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Track your interview confidence and resume strength over time with visual dashboards.",
  },
];

const Features = () => (
  <section id="features" className="py-24 md:py-32">
    <div className="container mx-auto px-6">
      <ScrollReveal className="text-center mb-16">
        <span className="text-sm font-medium text-accent tracking-wide uppercase">Features</span>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight mt-3 mb-4">
          Everything you need to prepare
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          From resume polish to live interview simulation — a complete toolkit for job seekers.
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 80}>
            <div className="group bg-card rounded-2xl p-7 border border-border/60 shadow-sm hover:shadow-md hover:border-border transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/15 transition-colors">
                <f.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-sans font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    description: "Drop in your PDF or paste text — our AI starts analyzing instantly.",
  },
  {
    number: "02",
    title: "Get detailed feedback",
    description: "Receive scores, suggestions, and rewrite options tailored to your target role.",
  },
  {
    number: "03",
    title: "Practice interviews",
    description: "Run through realistic Q&A sessions with follow-ups and behavioral analysis.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-secondary/40">
    <div className="container mx-auto px-6">
      <ScrollReveal className="text-center mb-16">
        <span className="text-sm font-medium text-accent tracking-wide uppercase">How it works</span>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight mt-3">
          Three steps to interview-ready
        </h2>
      </ScrollReveal>

      <div className="max-w-3xl mx-auto space-y-6">
        {steps.map((step, i) => (
          <ScrollReveal key={step.number} delay={i * 100}>
            <div className="flex gap-6 items-start bg-card rounded-2xl p-8 border border-border/60 shadow-sm">
              <span className="text-3xl font-display text-accent/30 shrink-0 leading-none pt-1">
                {step.number}
              </span>
              <div>
                <h3 className="font-sans font-semibold text-foreground text-lg mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-24 md:py-32">
    <div className="container mx-auto px-6">
      <ScrollReveal>
        <div className="relative max-w-3xl mx-auto text-center bg-primary rounded-3xl p-12 md:p-16 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.15),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-display text-primary-foreground tracking-tight mb-4">
              Ready to stand out?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
              Join thousands of job seekers who landed their dream roles with PrepWise.
            </p>
            <Button variant="hero" size="lg" className="text-base px-10 py-6 rounded-xl">
              <Link to="/mock-interview">Start Free — No Credit Card</Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-border/60 py-12">
    <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-display text-lg text-foreground">HireIQ</span>
      {/* <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <Link to="/privacy">Privacy</Link> |{" "}
        <Link to="/terms">Terms</Link> |{" "}
        <Link to="/contact">Contact</Link>
      </div> */}
      <span className="text-sm text-muted-foreground">© 2026 HireIQ. All rights reserved.</span>
    </div>
  </footer>
);

const LandingPage = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <Features />
    <HowItWorks />
    <CTA />
    <Footer />
  </div>
);

export default LandingPage;
