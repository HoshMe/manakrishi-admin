'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Shield, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react';

interface KYCDocument {
  id: number;
  user_id: number;
  user_name: string;
  user_phone: string;
  doc_type: string;
  doc_number: string;
  doc_image: string;
  uploaded_at: string;
}

export default function KYCPage() {
  const [docs, setDocs] = useState<KYCDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => { fetchPending(); }, []);

  const fetchPending = async () => {
    try {
      const data = await apiClient.get('/auth/kyc/pending/');
      setDocs(data || []);
    } catch (e) {}
    setLoading(false);
  };

  const filtered = docs.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.user_name?.toLowerCase().includes(q) ||
      d.user_phone?.toLowerCase().includes(q) ||
      d.doc_type?.toLowerCase().includes(q) ||
      d.doc_number?.toLowerCase().includes(q)
    );
  });

  const handleReview = async (docId: number, action: 'approve' | 'reject') => {
    const remarks = action === 'reject' ? prompt('Reason for rejection:') || '' : '';
    setReviewing(docId);
    try {
      await apiClient.post('/auth/kyc/review/', { doc_id: docId, action, remarks });
      setDocs(docs.filter(d => d.id !== docId));
    } catch (e) {
      alert('Failed to update');
    }
    setReviewing(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">KYC Verification</h1>
        <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-medium">
          {filtered.length} Pending
        </span>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, doc type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : docs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">No pending KYC documents</p>
          <p className="text-sm mt-1">All submissions have been reviewed</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{doc.user_name}</h3>
                  <p className="text-sm text-gray-500">{doc.user_phone}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium uppercase">
                      {doc.doc_type}
                    </span>
                    {doc.doc_number && (
                      <span className="text-xs text-gray-400">#{doc.doc_number}</span>
                    )}
                    <span className="text-xs text-gray-400">• {doc.uploaded_at}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.doc_image && (
                    <button
                      onClick={() => setPreviewImage(doc.doc_image)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleReview(doc.id, 'approve')}
                    disabled={reviewing === doc.id}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(doc.id, 'reject')}
                    disabled={reviewing === doc.id}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition text-sm font-medium"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>

              {doc.doc_image && (
                <div className="mt-3">
                  <img
                    src={doc.doc_image}
                    alt={doc.doc_type}
                    className="w-full max-h-48 object-cover rounded-lg border cursor-pointer"
                    onClick={() => setPreviewImage(doc.doc_image)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-3xl max-h-[90vh] p-4">
            <img src={previewImage} alt="Document" className="max-w-full max-h-full rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}
