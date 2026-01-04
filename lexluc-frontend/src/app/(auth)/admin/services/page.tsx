'use client';

import { useState } from 'react';
import { useFetch, useMutation, useToast } from '@/lib/hooks';
import { servicesAPI } from '@/lib/api';
import { Service } from '@/types';
import { Button, Input, Textarea, EmptyState, Table } from '@/components/common/UI';
import { ImageUpload } from '@/components/common/ImageUpload';
import { Modal } from '@/components/common/UI';

export default function AdminServicesPage() {
  const { data: servicesData, loading, refetch } = useFetch(() => servicesAPI.getAll());
  const services = Array.isArray(servicesData) ? servicesData : [];
  const { success, error: showError } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  interface FormData {
    name: string;
    slug: string;
    description: string;
    content: string;
    icon: string;
    image: string;
    order: number;
    isActive: boolean;
    metaTitle: string;
    metaDescription: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    content: '',
    icon: '',
    image: '',
    order: 0,
    isActive: true,
    metaTitle: '',
    metaDescription: '',
  });

  const createMutation = useMutation<Service, typeof formData>((data) => servicesAPI.create(data as Omit<Service, 'id' | 'createdAt' | 'updatedAt'>));
  const updateMutation = useMutation<Service, Partial<typeof formData>>((data) => servicesAPI.update(editingId!, data as Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>));

  const handleAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      content: '',
      icon: '',
      image: '',
      order: 0,
      isActive: true,
      metaTitle: '',
      metaDescription: '',
    });
    setShowModal(true);
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description,
      content: service.content || '',
      icon: service.icon || '',
      image: service.image || '',
      order: service.order || 0,
      isActive: service.isActive,
      metaTitle: service.metaTitle || '',
      metaDescription: service.metaDescription || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Service name is required');
      return;
    }

    if (!formData.description.trim()) {
      showError('Description is required');
      return;
    }

    // Filter out properties that shouldn't be sent to API
    const submitData = {
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      content: formData.content,
      icon: formData.icon,
      image: formData.image,
      order: formData.order,
      isActive: formData.isActive,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
    };

    try {
      if (editingId) {
        await updateMutation.mutate(submitData);
        success('Service updated successfully');
      } else {
        await createMutation.mutate(submitData);
        success('Service created successfully');
      }
      setShowModal(false);
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      await servicesAPI.delete(id);
      success('Service deleted successfully');
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to delete service');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
        <Button onClick={handleAdd}>+ Add Service</Button>
      </div>

      <Table
        loading={loading}
        empty={!loading && services.length === 0}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'description', label: 'Description', render: (v) => v?.substring(0, 50) + '...' },
          { key: 'isActive', label: 'Status', render: (v) => v ? '✓ Active' : '✗ Inactive' },
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
        data={services}
      />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Service' : 'Add Service'}
        actions={
          <div className="flex gap-2">
            <Button
              type="submit"
              form="service-form"
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
        <form id="service-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Service Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Slug"
            help="URL-friendly name (auto-generated from name)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />

          <Input
            label="Icon"
            help="Emoji or icon character"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            maxLength={4}
          />

          <Textarea
            label="Description"
            help="Short description (shown on services page)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <Textarea
            label="Content"
            help="Full content (shown on service detail page)"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={5}
          />

          <ImageUpload
            label="Service Image"
            type="service"
            preview={formData.image}
            onUpload={(url) => setFormData({ ...formData, image: url })}
          />

          <Input
            label="Meta Title"
            help="SEO title tag"
            value={formData.metaTitle}
            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
          />

          <Input
            label="Meta Description"
            help="SEO meta description"
            value={formData.metaDescription}
            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          />

          <Input
            label="Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
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
