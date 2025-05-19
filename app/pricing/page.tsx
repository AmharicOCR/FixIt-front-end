"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, X, Users, Shield, Zap, Database, Code, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PricingFaq } from "@/components/pricing/pricing-faq"
import { PaymentForm } from "@/components/pricing/payment-form"

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState("monthly")

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    window.scrollTo({
      top: document.getElementById("payment-section")?.offsetTop,
      behavior: "smooth",
    })
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Basic access for individual developers",
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      features: [
        { name: "Search for errors and solutions", included: true },
        { name: "View public errors and solutions", included: true },
        { name: "Submit up to 5 errors per month", included: true },
        { name: "Submit solutions to existing errors", included: true },
        { name: "Basic error categorization", included: true },
        { name: "Community support", included: true },
        { name: "Team collaboration tools", included: false },
        { name: "Advanced error tracking", included: false },
        { name: "API access", included: false },
        { name: "Priority support", included: false },
      ],
      cta: "Get Started",
      popular: false,
      icon: <Code className="h-5 w-5" />,
    },
    {
      id: "pro",
      name: "Professional",
      description: "For professional developers and small teams",
      monthlyPrice: "$19",
      yearlyPrice: "$190",
      features: [
        { name: "Everything in Free plan", included: true },
        { name: "Unlimited error submissions", included: true },
        { name: "Advanced error categorization", included: true },
        { name: "Private errors and solutions", included: true },
        { name: "Team collaboration (up to 5 members)", included: true },
        { name: "Basic API access", included: true },
        { name: "Email support", included: true },
        { name: "Advanced analytics", included: false },
        { name: "Custom integrations", included: false },
        { name: "Priority support", included: false },
      ],
      cta: "Choose Professional",
      popular: true,
      icon: <Zap className="h-5 w-5" />,
      savings: "$38",
    },
    {
      id: "team",
      name: "Team",
      description: "For development teams and organizations",
      monthlyPrice: "$49",
      yearlyPrice: "$490",
      features: [
        { name: "Everything in Professional plan", included: true },
        { name: "Team collaboration (up to 15 members)", included: true },
        { name: "Advanced error tracking and assignment", included: true },
        { name: "Advanced API access", included: true },
        { name: "Custom error categories", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Priority email support", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated account manager", included: false },
        { name: "Custom branding", included: false },
      ],
      cta: "Choose Team",
      popular: false,
      icon: <Users className="h-5 w-5" />,
      savings: "$98",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations with complex needs",
      monthlyPrice: "$99",
      yearlyPrice: "$990",
      features: [
        { name: "Everything in Team plan", included: true },
        { name: "Unlimited team members", included: true },
        { name: "Custom error workflows", included: true },
        { name: "Advanced security features", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "24/7 priority support", included: true },
        { name: "Custom branding", included: true },
        { name: "On-premise deployment option", included: true },
        { name: "Custom SLA", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
      icon: <Database className="h-5 w-5" />,
      savings: "$198",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              CER
            </div>
            <span>Code Error Repository</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
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
          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Button className="rounded-full">
              Sign Up
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  Membership Plans
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Choose the Right Plan for Your Needs
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Get access to powerful error tracking, collaboration tools, and expert solutions with our flexible
                  membership plans.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <Tabs
                defaultValue="monthly"
                className="w-full max-w-md"
                value={billingCycle}
                onValueChange={setBillingCycle}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm font-medium">Monthly</span>
                  <TabsList className="grid w-[200px] grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
                  </TabsList>
                  <span className="text-sm font-medium">Yearly</span>
                </div>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`flex h-full flex-col ${
                      plan.popular ? "border-primary shadow-lg" : "border-border shadow-md"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                        Most Popular
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {plan.icon}
                        </div>
                        {plan.id !== "free" && billingCycle === "yearly" && (
                          <Badge variant="outline" className="text-xs">
                            Save {plan.savings}/year
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="mb-4">
                        <span className="text-3xl font-bold">
                          {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-muted-foreground">
                          {plan.id !== "free" ? `/${billingCycle === "monthly" ? "month" : "year"}` : ""}
                        </span>
                      </div>

                      <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            {feature.included ? (
                              <Check className="mr-2 h-4 w-4 text-primary" />
                            ) : (
                              <X className="mr-2 h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={feature.included ? "" : "text-muted-foreground"}>{feature.name}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${plan.popular ? "" : "bg-muted hover:bg-muted/80"}`}
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => handleSelectPlan(plan.id)}
                      >
                        {plan.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 space-y-4">
              <h2 className="text-2xl font-bold text-center">Compare All Features</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-4 px-4 text-left font-medium">Feature</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="py-4 px-4 text-center font-medium">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Error Submissions</td>
                      <td className="py-4 px-4 text-center">5 per month</td>
                      <td className="py-4 px-4 text-center">Unlimited</td>
                      <td className="py-4 px-4 text-center">Unlimited</td>
                      <td className="py-4 px-4 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Team Members</td>
                      <td className="py-4 px-4 text-center">1</td>
                      <td className="py-4 px-4 text-center">Up to 5</td>
                      <td className="py-4 px-4 text-center">Up to 15</td>
                      <td className="py-4 px-4 text-center">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Private Errors</td>
                      <td className="py-4 px-4 text-center">
                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">API Access</td>
                      <td className="py-4 px-4 text-center">
                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                      </td>
                      <td className="py-4 px-4 text-center">Basic</td>
                      <td className="py-4 px-4 text-center">Advanced</td>
                      <td className="py-4 px-4 text-center">Full Access</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Error Assignment</td>
                      <td className="py-4 px-4 text-center">
                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Analytics</td>
                      <td className="py-4 px-4 text-center">Basic</td>
                      <td className="py-4 px-4 text-center">Standard</td>
                      <td className="py-4 px-4 text-center">Advanced</td>
                      <td className="py-4 px-4 text-center">Custom</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 px-4 font-medium">Support</td>
                      <td className="py-4 px-4 text-center">Community</td>
                      <td className="py-4 px-4 text-center">Email</td>
                      <td className="py-4 px-4 text-center">Priority Email</td>
                      <td className="py-4 px-4 text-center">24/7 Priority</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Custom Integrations</td>
                      <td className="py-4 px-4 text-center">
                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <X className="mx-auto h-5 w-5 text-muted-foreground" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Check className="mx-auto h-5 w-5 text-primary" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Section */}
        <section id="payment-section" className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            {selectedPlan ? (
              <div className="mx-auto max-w-3xl">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">
                    Complete Your {plans.find((p) => p.id === selectedPlan)?.name} Subscription
                  </h2>
                  <p className="text-muted-foreground">
                    You're signing up for the{" "}
                    <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.name}</span> plan with{" "}
                    <span className="font-medium">{billingCycle}</span> billing.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Enter your payment information to complete your subscription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PaymentForm
                      planName={plans.find((p) => p.id === selectedPlan)?.name || ""}
                      planPrice={
                        billingCycle === "monthly"
                          ? plans.find((p) => p.id === selectedPlan)?.monthlyPrice || ""
                          : plans.find((p) => p.id === selectedPlan)?.yearlyPrice || ""
                      }
                      billingCycle={billingCycle}
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-bold mb-2">Choose a Plan to Get Started</h2>
                <p className="text-muted-foreground mb-6">
                  Select one of our plans above to see payment options and complete your subscription.
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    View Plans
                  </Button>
                  <Button asChild>
                    <Link href="#pricing">Compare Features</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">Key Features</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Our platform provides powerful tools to help you track, resolve, and collaborate on software errors.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Code className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">Comprehensive Error Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Log, categorize, and track errors across different programming languages and frameworks with
                    detailed stack traces and code snippets.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Assign errors to team members, track progress, and collaborate on solutions with comments and
                    notifications.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">Secure and Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Keep your code secure with private errors and solutions, role-based access control, and encrypted
                    storage.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">Powerful Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Find solutions quickly with our advanced search capabilities, filtering by language, framework, and
                    error type.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Database className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">API Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Integrate with your existing tools and workflows using our comprehensive API for automated error
                    logging and reporting.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-4">Real-time Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay updated with real-time notifications for new errors, solutions, and comments relevant to your
                    team.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Find answers to common questions about our membership plans and features.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <PricingFaq />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Streamline Your Error Resolution?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join thousands of developers who are saving time and improving their code quality with Code Error
                  Repository.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full">
                  Get Started for Free
                </Button>
                <Button size="lg" variant="outline" className="rounded-full">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col gap-4 md:h-24 md:flex-row md:items-center md:justify-between md:gap-0">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              CER
            </div>
            <span>Code Error Repository</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact Us
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2023 Code Error Repository. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
