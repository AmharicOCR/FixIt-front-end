"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Bug,
  Users,
  Search,
  Shield,
  MessageSquare,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { authenticated, username, accountType, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const features = [
    {
      title: "Error Tracking",
      description:
        "Log, categorize, and track coding errors with detailed descriptions and priority levels.",
      icon: <Bug className="size-5" />,
    },
    {
      title: "Collaborative Solutions",
      description:
        "Work together to solve coding issues with comments, upvotes, and shared solutions.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Comprehensive Search",
      description:
        "Find solutions quickly with advanced search filters and AI-powered recommendations.",
      icon: <Search className="size-5" />,
    },
    {
      title: "Team Management",
      description:
        "Assign errors to team members and track progress from start to resolution.",
      icon: <MessageSquare className="size-5" />,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Gain insights with detailed reports on error patterns, resolution times, and team performance.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Secure & Scalable",
      description:
        "Enterprise-grade security with role-based access control and data encryption.",
      icon: <Shield className="size-5" />,
    },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
          isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Link href="/">
                <Bug className="size-5" />
              </Link>
            </div>
            <Link href="/">
              <span>FixIt</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#howitworks"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {mounted && theme === "dark" ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {!loading && !authenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Log in
                </Link>
                <Button className="rounded-full" asChild>
                  <Link href="/signup">
                    Get Started
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              !loading &&
              authenticated && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{username}</span>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      Dashboard
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {mounted && theme === "dark" ? (
                <Sun className="size-[18px]" />
              ) : (
                <Moon className="size-[18px]" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4">
              <Link
                href="#features"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#howitworks"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#pricing"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                className="py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                {!loading && !authenticated ? (
                  <>
                    <Link
                      href="/login"
                      className="py-2 text-sm font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Button className="rounded-full" asChild>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                        <ChevronRight className="ml-1 size-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  !loading &&
                  authenticated && (
                    <div className="flex flex-col gap-2">
                      <div className="py-2 text-sm font-medium">
                        Welcome, {username}
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full rounded-full">
                          Go to Dashboard
                        </Button>
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge
                className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                Code Error Repository System
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Fix Code Errors Faster Together
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                The collaborative platform for developers to log, share, and
                solve coding errors. Track issues, find solutions, and learn
                from the community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="rounded-full h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/public">Browse Public Errors</Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>14-day trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="size-4 text-primary" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <Image
                  src="/hero.png"
                  width={1280}
                  height={720}
                  alt="FixIt dashboard"
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Trusted by developers and teams worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Image
                    key={i}
                    src={`/placeholder-logo.svg`}
                    alt={`Company logo ${i}`}
                    width={120}
                    height={60}
                    className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Track, Solve, and Learn
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Our comprehensive platform provides all the tools you need to
                manage coding errors, collaborate with teammates, and improve
                code quality.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="howitworks"
          className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                How It Works
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                From Error to Resolution
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Our streamlined workflow makes solving code errors fast and
                efficient.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: "01",
                  title: "Log Your Error",
                  description:
                    "Describe your error with detailed information, code snippets, and assign a priority level.",
                },
                {
                  step: "02",
                  title: "Collaborate",
                  description:
                    "Get feedback from the community or assign the error to team members for faster resolution.",
                },
                {
                  step: "03",
                  title: "Implement Solutions",
                  description:
                    "Access verified solutions, track progress, and mark errors as resolved once fixed.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* User Roles Section */}
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                User Roles
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Access Levels for Every Need
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                FixIt provides different levels of access based on your
                requirements, from browsing solutions to managing teams.
              </p>
            </motion.div>

            <Tabs
              defaultValue="registered"
              className="w-full max-w-4xl mx-auto"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="rounded-full p-1">
                  <TabsTrigger value="guest" className="rounded-full px-6">
                    Guest
                  </TabsTrigger>
                  <TabsTrigger value="registered" className="rounded-full px-6">
                    Registered
                  </TabsTrigger>
                  <TabsTrigger value="premium" className="rounded-full px-6">
                    Premium
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="guest">
                <Card className="border-border/40 shadow-md overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-12 rounded-full bg-muted/80 flex items-center justify-center">
                        <Users className="size-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Guest User</h3>
                        <p className="text-muted-foreground">
                          Browse the knowledge base
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            Search for errors using keywords
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Find solutions to common coding problems
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            View public error logs and solutions
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Access a vast library of community solutions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 opacity-50">
                        <X className="size-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            Cannot comment, vote, or log new errors
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Limited to viewing existing content
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 opacity-50">
                        <X className="size-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            Cannot assign or track errors
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            No team management features
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="registered">
                <Card className="border-border/40 shadow-md overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bug className="size-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Registered User</h3>
                        <p className="text-muted-foreground">
                          Contribute to the community
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            Log new errors with details
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Title, description, category, and tags
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            Comment on errors and solutions
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Engage with the community
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Vote on solutions</h4>
                          <p className="text-sm text-muted-foreground">
                            Upvote and downvote community solutions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Access basic reports</h4>
                          <p className="text-sm text-muted-foreground">
                            View upvoted solutions, discussions, and more
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="premium">
                <Card className="border-primary shadow-lg overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                    Recommended
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="size-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Premium User</h3>
                        <p className="text-muted-foreground">
                          Team collaboration features
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            Create and join organizations/teams
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Collaborate with your team members
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">
                            Assign errors to team members
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Delegate tasks to the right people
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Track error status</h4>
                          <p className="text-sm text-muted-foreground">
                            Monitor progress from open to resolved
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="size-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Advanced reporting</h4>
                          <p className="text-sm text-muted-foreground">
                            Team-level analytics and insights
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                Pricing
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Choose the plan that's right for your team. All plans include a
                14-day free trial.
              </p>
            </motion.div>

            <div className="mx-auto max-w-5xl">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="rounded-full p-1">
                    <TabsTrigger value="monthly" className="rounded-full px-6">
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="annually" className="rounded-full px-6">
                      Annually (Save 20%)
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="monthly">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "Free",
                        price: "$0",
                        description: "For individual developers.",
                        features: [
                          "Search for errors",
                          "View public solutions",
                          "Log and manage errors",
                          "Comment and vote on solutions",
                          "Basic reports",
                        ],
                        cta: "Sign Up Free",
                      },
                      {
                        name: "Team",
                        price: "$49",
                        description: "For development teams and startups.",
                        features: [
                          "Everything in Free",
                          "Team collaboration",
                          "Assign errors to team members",
                          "Track error resolution status",
                          "Private team solutions",
                          "Team-level reports and analytics",
                          "Priority email support",
                        ],
                        cta: "Start Free Trial",
                        popular: true,
                      },
                      {
                        name: "Enterprise",
                        price: "$199",
                        description: "For organizations with advanced needs.",
                        features: [
                          "Everything in Team",
                          "Unlimited team members",
                          "Advanced security features",
                          "Custom API integrations",
                          "Dedicated customer success manager",
                          "24/7 premium support",
                          "Custom onboarding",
                        ],
                        cta: "Contact Sales",
                      },
                    ].map((plan, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden h-full ${
                            plan.popular
                              ? "border-primary shadow-lg"
                              : "border-border/40 shadow-md"
                          } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold">
                                {plan.price}
                              </span>
                              {plan.price !== "$0" && (
                                <span className="text-muted-foreground ml-1">
                                  /month
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {plan.description}
                            </p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="mr-2 size-4 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full mt-auto rounded-full ${
                                plan.popular
                                  ? "bg-primary hover:bg-primary/90"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                              variant={plan.popular ? "default" : "outline"}
                              asChild
                            >
                              <Link
                                href={
                                  plan.name === "Enterprise"
                                    ? "/contact"
                                    : "/signup"
                                }
                              >
                                {plan.cta}
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="annually">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "Free",
                        price: "$0",
                        description: "For individual developers.",
                        features: [
                          "Search for errors",
                          "View public solutions",
                          "Log and manage errors",
                          "Comment and vote on solutions",
                          "Basic reports",
                        ],
                        cta: "Sign Up Free",
                      },
                      {
                        name: "Team",
                        price: "$39",
                        description: "For development teams and startups.",
                        features: [
                          "Everything in Free",
                          "Team collaboration",
                          "Assign errors to team members",
                          "Track error resolution status",
                          "Private team solutions",
                          "Team-level reports and analytics",
                          "Priority email support",
                        ],
                        cta: "Start Free Trial",
                        popular: true,
                      },
                      {
                        name: "Enterprise",
                        price: "$159",
                        description: "For organizations with advanced needs.",
                        features: [
                          "Everything in Team",
                          "Unlimited team members",
                          "Advanced security features",
                          "Custom API integrations",
                          "Dedicated customer success manager",
                          "24/7 premium support",
                          "Custom onboarding",
                        ],
                        cta: "Contact Sales",
                      },
                    ].map((plan, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden h-full ${
                            plan.popular
                              ? "border-primary shadow-lg"
                              : "border-border/40 shadow-md"
                          } bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold">
                                {plan.price}
                              </span>
                              {plan.price !== "$0" && (
                                <span className="text-muted-foreground ml-1">
                                  /month
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground mt-2">
                              {plan.description}
                            </p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="mr-2 size-4 text-primary" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full mt-auto rounded-full ${
                                plan.popular
                                  ? "bg-primary hover:bg-primary/90"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                              variant={plan.popular ? "default" : "outline"}
                              asChild
                            >
                              <Link
                                href={
                                  plan.name === "Enterprise"
                                    ? "/contact"
                                    : "/signup"
                                }
                              >
                                {plan.cta}
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                variant="secondary"
              >
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Find answers to common questions about FixIt.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How does the 14-day free trial work?",
                    answer:
                      "Our 14-day free trial gives you full access to all premium features. No credit card is required to sign up, and you can cancel at any time during the trial period with no obligation.",
                  },
                  {
                    question: "Can I integrate FixIt with my existing tools?",
                    answer:
                      "Yes, FixIt provides RESTful API access for integration with IDEs, code repositories like GitHub and GitLab, and other development tools. Premium plans include additional integration options and webhooks for real-time notifications.",
                  },
                  {
                    question: "Is my code or error information secure?",
                    answer:
                      "Absolutely. FixIt employs enterprise-grade security with data encryption both in transit and at rest. All data is stored securely, and we offer role-based access controls to ensure your sensitive information remains protected.",
                  },
                  {
                    question: "Can I upgrade or downgrade my plan later?",
                    answer:
                      "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.",
                  },
                  {
                    question: "What kind of support do you offer?",
                    answer:
                      "Support varies by plan. Free users have access to community support. Team plan users receive priority email support during business hours. Enterprise customers enjoy 24/7 premium support with a dedicated customer success manager.",
                  },
                  {
                    question: "Can I export my data?",
                    answer:
                      "Yes, we provide data export options in CSV and PDF formats for all your logged errors, solutions, and reports. Team and Enterprise plans have additional export capabilities for audit logs and team analytics.",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem
                      value={`item-${i}`}
                      className="border-b border-border/40 py-2"
                    >
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Ready to Fix Errors Faster?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Join thousands of developers who have streamlined their
                debugging process and improved their code quality with FixIt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full h-12 px-8 text-base"
                  asChild
                >
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/public-errors">Browse Public Errors</Link>
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-4">
                No credit card required. 14-day free trial. Cancel anytime.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                  <Bug className="size-5" />
                </div>
                <span>FixIt</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The collaborative platform for developers to log, share, and
                solve coding errors efficiently.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} FixIt. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
