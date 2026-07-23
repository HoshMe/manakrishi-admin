'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const SERVICE_LABELS: Record<string, string> = {
  drone_spraying: 'Drone Spraying',
  tractor_rental: 'Tractor Rental',
  rotavator: 'Rotavator',
  harvester: 'Harvester',
  seed_drill: 'Seed Drill',
  water_tanker: 'Water Tanker',
  cultivator: 'Cultivator',
  fertilizer_spraying: 'Fertilizer Spraying',
};

const SERVICE_ICONS: Record<string, string> = {
  drone_spraying: '🚁', tractor_rental: '🚜', rotavator: '⚙️',
  harvester: '🌾', seed_drill: '🌱', water_tanker: '💧',
  cultivator: '🔧', fertilizer_spraying: '🌿',
};

export default function SettingsPage() {
  const [pricing, setPricing] = useState<Record<string, number>>({});
  const [edited, setEdited] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchPricing(); }, []);

  const fetchPricing = async () => {
    setLoading(true);
    const data = await api.getServicePricing();
    if (!data.error) {
      setPricing(data);
      setEdited(data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await api.updateServicePricing(edited);
    if (res.status === 'updated') {
      setPricing(edited);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const hasChanges = Object.keys(edited).some(k => edited[k] !== pricing[k]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {/* Service Pricing */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Service Pricing</h2>
            <p className="text-sm text-gray-500 mt-1">Price per acre for each service</p>
          </div>
          {saved && <span className="text-sm text-green-600 font-medium">✓ Saved successfully</span>}
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(SERVICE_LABELS).map((svc) => (
              <div key={svc} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                <span className="text-2xl">{SERVICE_ICONS[svc]}</span>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{SERVICE_LABELS[svc]}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={edited[svc] ?? ''}
                      onChange={(e) => setEdited({ ...edited, [svc]: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-gray-400 text-xs whitespace-nowrap">/ acre</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="bg-green-700 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Pricing'}
          </button>
          {hasChanges && (
            <button onClick={() => setEdited(pricing)} className="text-sm text-gray-500 hover:text-gray-700">
              Reset changes
            </button>
          )}
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-2xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">General</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
            <input type="text" defaultValue="8886124318" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input type="email" defaultValue="support@manakrishi.in" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dealer Commission (%)</label>
            <input type="number" defaultValue="10" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
