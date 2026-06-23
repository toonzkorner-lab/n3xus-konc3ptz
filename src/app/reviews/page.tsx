import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewsClient from './ReviewsClient';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Reviews & Testimonials | N3xUs Konc3pt\'z',
  description: 'See what our clients say about us and leave your own review.',
};

export default async function ReviewsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-xl section">
        <div className="container max-w-4xl mx-auto">
          <div className="section-header text-center">
            <h1 className="text-4xl font-heading text-primary mb-md glow-text">Client Reviews</h1>
            <p className="text-lg text-secondary">
              What others say about their journey with N3xUs. Have we worked together? Leave your feedback!
            </p>
          </div>
          
          <ReviewsClient initialReviews={testimonials} />
        </div>
      </main>
      <Footer />
    </>
  );
}
