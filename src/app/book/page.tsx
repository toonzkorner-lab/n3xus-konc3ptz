import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Book a Consultation | N3xUs Konc3pt\'z',
  description: 'Schedule a free consultation with N3xUs Konc3pt\'z to discuss your project, custom bot, or API needs.',
};

export default function BookPage() {
  return (
    <div className="container py-xl min-h-screen mt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-xl">
          <h1 className="text-5xl font-heading text-primary mb-md glow-text-primary">Let's Build Something Cosmic</h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Ready to bring your vision to reality? Schedule a free 30-minute consultation with our lead architect. We'll discuss your requirements, timeline, and how N3xUs Konc3pt'z can help.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-subtle p-lg shadow-glow overflow-hidden">
          {/* Calendly inline widget begin */}
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/jsocarras499" 
            style={{ minWidth: '320px', height: '700px' }} 
          />
          <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
          {/* Calendly inline widget end */}
        </div>

        <div className="mt-xl text-center">
          <h3 className="text-2xl font-heading text-secondary mb-sm">Not ready for a call?</h3>
          <p className="text-secondary mb-md">You can always send us a message through our contact portal or via Discord.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary">Go to Contact Portal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
