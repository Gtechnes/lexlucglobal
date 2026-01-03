import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Lexluc Global Services',
  description: 'Learn about Lexluc Global Services - our mission, vision, and commitment to excellence',
};

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">About Lexluc Global Services</h1>
          <p className="text-gray-300 mt-2">Excellence, Innovation & Reliability</p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
              <p className="text-gray-600 mb-4">
                Lexluc Global Services and Tours Limited is a premier service provider in tourism, agriculture, mining, oil & gas, recreation, transportation & logistics sectors.
              </p>
              <p className="text-gray-600">
                With years of industry experience, we deliver world-class solutions tailored to meet the unique needs of each client.
              </p>
            </div>
            <div className="bg-blue-100 rounded-lg h-96 flex items-center justify-center text-6xl">
              🏢
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                🎯 Our Mission
              </h3>
              <p className="text-gray-700">
                To provide innovative, reliable, and sustainable services that create value for our clients, employees, and communities while maintaining the highest standards of integrity and professionalism.
              </p>
            </div>
            <div className="bg-purple-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                ⭐ Our Vision
              </h3>
              <p className="text-gray-700">
                To be the leading service provider in West Africa, recognized for our expertise, innovation, and commitment to transforming industries through sustainable solutions and strategic partnerships.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Core Values</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: 'Integrity', icon: '🤝' },
                { title: 'Excellence', icon: '⚡' },
                { title: 'Innovation', icon: '💡' },
                { title: 'Sustainability', icon: '🌱' },
              ].map((value) => (
                <div key={value.title} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h4 className="font-bold text-lg">{value.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
