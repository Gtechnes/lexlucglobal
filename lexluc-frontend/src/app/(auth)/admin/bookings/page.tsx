'use client';

import { useFetch, useToast } from '@/lib/hooks';
import { bookingsAPI } from '@/lib/api';
import { Booking, BookingStatus } from '@/types';
import { Table, Badge, Button, Card } from '@/components/common/UI';
import { useState } from 'react';

export default function AdminBookingsPage() {
  const { data: bookingsData, loading, refetch } = useFetch(() => bookingsAPI.getAll());
  const bookings = Array.isArray(bookingsData) ? bookingsData : [];
  const { success, error: showError } = useToast();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<BookingStatus | ''>('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleStatusChange = async (id: string) => {
    if (!newStatus) return;
    try {
      setStatusUpdating(true);
      await bookingsAPI.updateStatus(id, newStatus);
      success('Booking status updated');
      setSelectedBooking(null);
      setNewStatus('');
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await bookingsAPI.delete(id);
      success('Booking deleted successfully');
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to delete booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      'CONFIRMED': 'success',
      'PENDING': 'warning',
      'CANCELLED': 'error',
      'COMPLETED': 'success',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookings Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Table
            loading={loading}
            empty={!loading && bookings.length === 0}
            columns={[
              { key: 'firstName', label: 'Guest Name', render: (v, row) => `${row.firstName} ${row.lastName}` },
              { key: 'referenceNo', label: 'Reference' },
              { key: 'numberOfParticipants', label: 'Participants' },
              { key: 'status', label: 'Status', render: (v) => getStatusBadge(v) },
              {
                key: 'actions',
                label: 'Actions',
                render: (_, row) => (
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBooking(row);
                        setNewStatus(row.status);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Update
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
            data={bookings}
          />
        </div>

        {selectedBooking && (
          <Card className="p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Guest</p>
                <p className="font-semibold text-gray-900">
                  {selectedBooking.firstName} {selectedBooking.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reference</p>
                <p className="font-semibold text-gray-900">{selectedBooking.referenceNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-900">{selectedBooking.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="font-semibold text-gray-900">{selectedBooking.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Price</p>
                <p className="font-semibold text-gray-900">₦{selectedBooking.totalPrice?.toLocaleString()}</p>
              </div>

              <hr />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as BookingStatus | '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStatusChange(selectedBooking.id)}
                  loading={statusUpdating}
                  className="flex-1"
                >
                  Update
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
