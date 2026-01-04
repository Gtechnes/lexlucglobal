'use client';

import { useState } from 'react';
import { useFetch, useMutation, useToast } from '@/lib/hooks';
import { toursAPI } from '@/lib/api';
import { Tour } from '@/types';
import { Button, Input, Textarea, Table } from '@/components/common/UI';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Modal } from '@/components/common/UI';

export default function AdminToursPage() {
  const { data: toursData, loading, refetch } = useFetch(() => toursAPI.getAll());
  const tours = Array.isArray(toursData) ? toursData : [];
  const { success, error: showError } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  interface FormData {
    title: string;
    slug: string;
    description: string;
    content: string;
    destination: string;
    duration: number;
    price: number;
    maxParticipants: number | null;
    image: string;
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    itinerary: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
    metaTitle: string;
    metaDescription: string;
  }

  const [formData, setFormData] = useState<FormData>({
    title: '',
    slug: '',
    description: '',
    content: '',
    destination: '',
    duration: 1,
    price: 0,
    maxParticipants: null,
    image: '',
    highlights: [],
    inclusions: [],
    exclusions: [],
    itinerary: '',
    startDate: '',
    endDate: '',
    isActive: true,
    metaTitle: '',
    metaDescription: '',
  });

  const createMutation = useMutation<Tour, typeof formData>((data) => toursAPI.create(data as Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>));
  const updateMutation = useMutation<Tour, Partial<typeof formData>>((data) => toursAPI.update(editingId!, data as Partial<Omit<Tour, 'id' | 'createdAt' | 'updatedAt'>>));

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      destination: '',
      duration: 1,
      price: 0,
      maxParticipants: null,
      image: '',
      highlights: [],
      inclusions: [],
      exclusions: [],
      itinerary: '',
      startDate: '',
      endDate: '',
      isActive: true,
      metaTitle: '',
      metaDescription: '',
    });
    setShowModal(true);
  };

  const handleEdit = (tour: Tour) => {
    setEditingId(tour.id);
    setFormData({
      title: tour.title,
      slug: tour.slug,
      description: tour.description,
      content: tour.content || '',
      destination: tour.destination,
      duration: tour.duration,
      price: tour.price,
      maxParticipants: tour.maxParticipants || null,
      image: tour.image || '',
      highlights: tour.highlights || [],
      inclusions: tour.inclusions || [],
      exclusions: tour.exclusions || [],
      itinerary: tour.itinerary || '',
      startDate: tour.startDate || '',
      endDate: tour.endDate || '',
      isActive: tour.isActive,
      metaTitle: tour.metaTitle || '',
      metaDescription: tour.metaDescription || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showError('Tour title is required');
      return;
    }

    if (!formData.destination.trim()) {
      showError('Destination is required');
      return;
    }

    if (formData.duration < 1) {
      showError('Duration must be at least 1 day');
      return;
    }

    // Filter out properties that shouldn't be sent to API
    const submitData = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      content: formData.content,
      destination: formData.destination,
      duration: formData.duration,
      price: formData.price,
      maxParticipants: formData.maxParticipants,
      image: formData.image,
      highlights: formData.highlights,
      inclusions: formData.inclusions,
      exclusions: formData.exclusions,
      itinerary: formData.itinerary,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
    };

    try {
      if (editingId) {
        await updateMutation.mutate(submitData);
        success('Tour updated successfully');
      } else {
        await createMutation.mutate(submitData);
        success('Tour created successfully');
      }
      setShowModal(false);
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to save tour');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return;

    try {
      await toursAPI.delete(id);
      success('Tour deleted successfully');
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to delete tour');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
        <Button onClick={handleAdd}>+ Add Tour</Button>
      </div>

      <Table
        loading={loading}
        empty={!loading && tours.length === 0}
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'destination', label: 'Destination' },
          { key: 'duration', label: 'Duration', render: (v) => `${v} days` },
          { key: 'price', label: 'Price', render: (v) => `₦${v?.toLocaleString()}` },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(row)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        data={tours}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Tour' : 'Add Tour'}
        actions={
          <div className="flex gap-2">
            <Button
              type="submit"
              form="tour-form"
              loading={createMutation.loading || updateMutation.loading}
              className="flex-1"
            >
              {editingId ? 'Update' : 'Create'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <form id="tour-form" onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <Input
            label="Tour Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Input
            label="Slug"
            help="URL-friendly name"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />

          <Input
            label="Destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            required
          />

          <Input
            label="Duration (days)"
            type="number"
            min="1"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            required
          />

          <Input
            label="Price (NGN)"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />

          <Input
            label="Max Participants"
            type="number"
            min="1"
            value={formData.maxParticipants || ''}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value ? parseInt(e.target.value) : null })}
          />

          <Textarea
            label="Description"
            help="Short description for listing"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <Textarea
            label="Content"
            help="Full content for detail page"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
          />

          <ImageUpload
            label="Tour Image"
            type="tour"
            preview={formData.image}
            onUpload={(url) => setFormData({ ...formData, image: url })}
          />

          <Textarea
            label="Itinerary"
            help="Day-by-day itinerary"
            value={formData.itinerary}
            onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
            rows={4}
          />

          <div className="grid md:grid-cols-2 gap-2">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <Input
            label="Meta Title"
            help="SEO title"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          />

          <Input
            label="Meta Description"
            help="SEO meta description"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </form>
      </Modal>
    </div>
  );
}
