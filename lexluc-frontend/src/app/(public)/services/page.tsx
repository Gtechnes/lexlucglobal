'use client';

import { Metadata } from 'next';
import { useFetch } from '@/lib/hooks';
import { servicesAPI } from '@/lib/api';
import { Card, Loader, EmptyState, Button } from '@/components/common/UI';
import Link from 'next/link';

// Note: Metadata is only available in server components
// Move to layout if needed for static generation
// export const metadata: Metadata = {
//   title: 'Services | Lexluc Global Services',
//   description: 'Discover our comprehensive services across tourism, agriculture, mining, and more',
// };

export default function ServicesPage() {
  const { data: servicesData, loading, error } = useFetch(() => servicesAPI.getAll());
  const services = Array.isArray(servicesData) ? servicesData : [];

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Our Services</h1>
          <p className="text-gray-300 mt-2">Expert solutions across multiple industries</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <Loader />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
              <p className="font-semibold">Error loading services</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <EmptyState
              icon="🔧"
              title="No Services Available"
              description="Services are being set up. Please check back soon."
            />
          )}

          {!loading && !error && services.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service: any) => (
                <Card key={service.id} className="p-8 flex flex-col">
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-48 object-cover rounded mb-4 -m-8 mb-4"
                    />
                  )}
                  {service.icon && <div className="text-5xl mb-4">{service.icon}</div>}
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Learn more →
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Our Services?</h2>
          <p className="text-xl mb-8">Contact us to discuss your requirements</p>
          <Link href="/contact">
            <Button variant="secondary">Request a Quote</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
