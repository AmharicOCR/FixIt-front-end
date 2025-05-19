"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function PricingFaq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What's included in the free plan?</AccordionTrigger>
        <AccordionContent>
          The free plan includes basic access to our platform, allowing you to search for errors and solutions, view
          public errors and solutions, submit up to 5 errors per month, and submit solutions to existing errors. You'll
          also have access to basic error categorization and community support.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Can I upgrade or downgrade my plan at any time?</AccordionTrigger>
        <AccordionContent>
          Yes, you can upgrade your plan at any time, and the new pricing will be prorated for the remainder of your
          billing cycle. If you downgrade, the new pricing will take effect at the start of your next billing cycle.
          There are no penalties or fees for changing your plan.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How does the team collaboration feature work?</AccordionTrigger>
        <AccordionContent>
          Team collaboration allows you to invite team members to your workspace, assign errors to specific team
          members, track the status of assigned errors, and collaborate on solutions. Team members can comment on errors
          and solutions, receive notifications for updates, and work together to resolve issues more efficiently.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Is there a limit to how many errors I can submit?</AccordionTrigger>
        <AccordionContent>
          The free plan allows you to submit up to 5 errors per month. The Professional, Team, and Enterprise plans all
          include unlimited error submissions. This means you can log as many errors as you need without worrying about
          hitting a limit.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>Do you offer discounts for nonprofits or educational institutions?</AccordionTrigger>
        <AccordionContent>
          Yes, we offer special pricing for nonprofits, educational institutions, and open-source projects. Please
          contact our sales team for more information about our discount programs and to see if your organization
          qualifies.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>How secure is my code and error data?</AccordionTrigger>
        <AccordionContent>
          We take security very seriously. All data is encrypted both in transit and at rest. We use industry-standard
          security practices and regularly undergo security audits. Our platform is compliant with GDPR, CCPA, and other
          relevant regulations. Additionally, with our Professional plan and above, you can mark errors as private so
          they're only visible to your team.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-7">
        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
        <AccordionContent>
          We accept all major credit cards, including Visa, Mastercard, American Express, and Discover. For Enterprise
          plans, we also offer invoice payment options. If you need alternative payment methods, please contact our
          sales team.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-8">
        <AccordionTrigger>Can I cancel my subscription at any time?</AccordionTrigger>
        <AccordionContent>
          Yes, you can cancel your subscription at any time from your account settings. If you cancel, you'll continue
          to have access to your paid features until the end of your current billing cycle. After that, your account
          will revert to the free plan. We don't offer refunds for partial billing periods.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-9">
        <AccordionTrigger>What kind of support do you offer?</AccordionTrigger>
        <AccordionContent>
          Support varies by plan. The free plan includes community support through our forums. The Professional plan
          includes email support with a 24-hour response time. The Team plan includes priority email support with a
          12-hour response time. The Enterprise plan includes 24/7 priority support via email and phone, as well as a
          dedicated account manager.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-10">
        <AccordionTrigger>Is there a trial period for paid plans?</AccordionTrigger>
        <AccordionContent>
          Yes, we offer a 14-day free trial for all paid plans. No credit card is required to start a trial. During the
          trial, you'll have full access to all features of the selected plan. If you decide not to continue, your
          account will automatically revert to the free plan at the end of the trial period.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
