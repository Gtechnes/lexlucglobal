'use client';

import { useFetch, useMutation, useToast } from '@/lib/hooks';
import { contactsAPI } from '@/lib/api';
import { Card, Badge, Button, Textarea, Modal } from '@/components/common/UI';
import { useState } from 'react';

export default function AdminContactsPage() {
  const { data: contactsData, loading, refetch } = useFetch(() => contactsAPI.getAll());
  const contacts = Array.isArray(contactsData) ? contactsData : [];
  const { success, error: showError } = useToast();

  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');

  type ReplyPayload = {
  response: string;
  };

  const replyMutation = useMutation((data: ReplyPayload) =>
  contactsAPI.respond(selectedContact.id, data.response)
  );


  const handleMarkAsRead = async (id: string) => {
    try {
      await contactsAPI.markAsRead(id);
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to mark as read');
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      showError('Reply cannot be empty');
      return;
    }
    try {
      await replyMutation.mutate({ response: replyText });
      success('Reply sent successfully');
      setShowReplyModal(false);
      setReplyText('');
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to send reply');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactsAPI.delete(id);
      success('Message deleted successfully');
      setSelectedContact(null);
      refetch();
    } catch (err: any) {
      showError(err.message || 'Failed to delete message');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      'NEW': 'warning',
      'READ': 'info',
      'RESPONDED': 'success',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-20 animate-pulse" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <Card className="p-8 text-center text-gray-600">
              <p>No contact messages yet</p>
            </Card>
          ) : (
            contacts.map((contact: any) => (
              <Card
                key={contact.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => {
                  setSelectedContact(contact);
                  if (contact.status === 'NEW') handleMarkAsRead(contact.id);
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    {contact.phone && (
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    )}
                    <p className="text-gray-700 mt-2 line-clamp-2">{contact.subject}</p>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-1">{contact.message}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(contact.status)}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {selectedContact && (
          <Card className="p-6 lg:sticky lg:top-8 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Name</p>
                <p className="text-gray-900 font-semibold">
                  {selectedContact.firstName} {selectedContact.lastName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Email</p>
                <p className="text-gray-900 break-all">{selectedContact.email}</p>
              </div>
              {selectedContact.phone && (
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Phone</p>
                  <p className="text-gray-900">{selectedContact.phone}</p>
                </div>
              )}
              {selectedContact.company && (
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Company</p>
                  <p className="text-gray-900">{selectedContact.company}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold">Subject</p>
                <p className="text-gray-900">{selectedContact.subject}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Message</p>
                <p className="text-gray-700 whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">
                  {selectedContact.message}
                </p>
              </div>
              {selectedContact.response && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-xs text-green-700 uppercase font-semibold mb-2">Your Reply</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {selectedContact.response}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => setShowReplyModal(true)}
                className="w-full"
              >
                Reply
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(selectedContact.id)}
                className="w-full"
              >
                Delete
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        title={`Reply to ${selectedContact?.firstName} ${selectedContact?.lastName}`}
        actions={
          <div className="flex gap-2">
            <Button
              type="submit"
              form="reply-form"
              loading={replyMutation.loading}
              className="flex-1"
            >
              Send Reply
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowReplyModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <form id="reply-form" onSubmit={handleReply} className="space-y-4">
          <Textarea
            label={`Reply to ${selectedContact?.firstName}`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={5}
            required
          />
        </form>
      </Modal>
    </div>
  );
}
