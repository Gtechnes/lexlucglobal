'use client';

import { useFetch } from '@/lib/hooks';
import { toursAPI } from '@/lib/api';
import { Card, Loader, EmptyState, Button } from '@/components/common/UI';
import { Badge } from '@/components/common/UI';
import Link from 'next/link';

export default function ToursPage() {
  const { data: toursData, loading, error } = useFetch(() => toursAPI.getAll());
  const tours = Array.isArray(toursData) ? toursData : [];

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Tours & Destinations</h1>
          <p className="text-gray-300 mt-2">Unforgettable travel experiences await you</p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <Loader />}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
              <p className="font-semibold">Error loading tours</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && tours.length === 0 && (
            <EmptyState
              icon="🌍"
              title="No Tours Available"
              description="Tour packages are being prepared. Check back soon for amazing destinations!"
            />
          )}

          {!loading && !error && tours.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour: any) => (
                <Card key={tour.id} className="overflow-hidden flex flex-col">
                  {tour.image ? (
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="h-48 object-cover w-full"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-48 flex items-center justify-center text-6xl">
                      🌍
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">📍 {tour.destination}</p>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">
                      {tour.description}
                    </p>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <Badge variant="info">{tour.duration} days</Badge>
                      {tour.maxParticipants && (
                        <Badge variant="default">Max {tour.maxParticipants} people</Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-blue-600 font-bold text-lg">
                        ${Number(tour.price || 0).toFixed(2)}
                      </span>
                      <Link href={`/tours/${tour.slug}`}>
                        <Button size="sm">Learn More</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
