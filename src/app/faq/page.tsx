'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What services does N3xUs Konc3pt\'z offer?',
        a: 'We specialize in custom Discord bots, Telegram bots, full-stack web development, API development, e-commerce platforms, custom CRM systems, and comprehensive digital design solutions.'
      },
      {
        q: 'How do I get started?',
        a: 'Simply fill out our contact form, send us a message on Discord, or reach out via Telegram. We\'ll schedule a free consultation to discuss your project goals, timeline, and budget.'
      },
      {
        q: 'What is your typical turnaround time?',
        a: 'Turnaround depends on project scope. Simple bots take 1-2 weeks, websites 2-4 weeks, and complex platforms or enterprise solutions 4-8 weeks. We always provide a timeline estimate during your consultation.'
      },
    ]
  },
  {
    category: 'Pricing & Payment',
    questions: [
      {
        q: 'How much do your services cost?',
        a: 'Pricing varies by project complexity and scope. Check our Services page for starting prices, or request a custom quote for a tailored estimate. We offer competitive rates for indie developers and small businesses.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards through Stripe. For larger projects, we also offer direct invoicing with NET-15 or NET-30 terms.'
      },
      {
        q: 'Do you offer payment plans?',
        a: 'Yes! For projects over $500, we offer milestone-based payment plans. You pay a deposit upfront, then installments as we hit key deliverables. This way you only pay for completed work.'
      },
    ]
  },
  {
    category: 'Technical',
    questions: [
      {
        q: 'What technologies do you use?',
        a: 'Our core stack includes Next.js, React, Node.js, Python, Discord.js, Telegraf, Prisma, PostgreSQL, Stripe, and more. We choose the best tools for each project\'s specific needs.'
      },
      {
        q: 'Do you provide hosting?',
        a: 'Yes, we offer managed hosting for bots and web applications. Our infrastructure is optimized for performance and uptime, with 24/7 monitoring included.'
      },
      {
        q: 'Do you offer maintenance and support?',
        a: 'Absolutely. All projects include 30 days of free post-launch support. After that, we offer monthly maintenance plans starting at $50/month for ongoing updates, monitoring, and priority support.'
      },
    ]
  },
  {
    category: 'Process',
    questions: [
      {
        q: 'How does the project process work?',
        a: 'Our process follows six stages: Discovery (understanding your needs) → Proposal (scope, timeline, cost) → Development (building your solution) → Testing (QA and refinement) → Launch (going live) → Support (post-launch care).'
      },
      {
        q: 'Can I see progress during development?',
        a: 'Yes! Every client gets access to our private client dashboard with real-time project tracking, task updates, milestone notifications, and direct messaging with our team.'
      },
      {
        q: 'What if I need changes after launch?',
        a: 'We offer revision packages and ongoing maintenance contracts. Minor tweaks within the first 30 days are covered free of charge. For larger changes, we\'ll provide a quick quote.'
      },
    ]
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-subtle rounded-lg overflow-hidden transition-colors hover:border-primary/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-lg flex justify-between items-center gap-md bg-card hover:bg-tertiary transition-colors cursor-pointer"
        style={{ border: 'none', color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}
      >
        <span className="font-bold">{question}</span>
        <span className="text-primary text-xl flex-shrink-0" style={{ transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? '300px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, padding 0.3s ease',
        padding: open ? 'var(--space-md) var(--space-lg) var(--space-lg)' : '0 var(--space-lg)',
      }}>
        <p className="text-secondary" style={{ lineHeight: '1.7' }}>{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="section" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-4xl))' }}>
          <div className="container container-md">
            <div className="text-center mb-3xl">
              <h1 className="text-5xl font-heading glow-text mb-md">Frequently Asked Questions</h1>
              <p className="text-lg text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                Everything you need to know about working with N3xUs Konc3pt&apos;z. Can&apos;t find what you&apos;re looking for? <a href="/contact" className="text-primary hover:underline">Contact us</a>.
              </p>
            </div>

            <div className="flex flex-col gap-2xl">
              {faqs.map((section) => (
                <div key={section.category}>
                  <h2 className="text-2xl font-heading text-primary mb-lg flex items-center gap-sm">
                    <span className="w-2 h-8 bg-gradient-primary rounded-full" style={{ display: 'inline-block' }}></span>
                    {section.category}
                  </h2>
                  <div className="flex flex-col gap-sm">
                    {section.questions.map((item) => (
                      <FAQItem key={item.q} question={item.q} answer={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-3xl pt-2xl border-t border-subtle">
              <h3 className="text-2xl font-heading text-primary mb-md">Still Have Questions?</h3>
              <p className="text-secondary mb-lg">Our team is ready to help you with any additional questions.</p>
              <div className="flex gap-md justify-center flex-wrap">
                <a href="/contact" className="btn btn-primary btn-lg">Contact Us</a>
                <a href="/quote" className="btn btn-secondary btn-lg">Request a Quote</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
