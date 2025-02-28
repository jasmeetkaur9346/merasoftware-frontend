import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const AdminFileSettings = () => {
  const [fileExpirationDays, setFileExpirationDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch current settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getAdminUpdateSettings.url, {
        method: SummaryApi.getAdminUpdateSettings.method,
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        setFileExpirationDays(data.data.fileExpirationDays);
      } else {
        toast.error(data.message || 'Failed to load file settings');
      }
    } catch (error) {
      console.error('Error fetching file settings:', error);
      toast.error('Failed to load file settings');
    } finally {
      setLoading(false);
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch(SummaryApi.adminUpdateSettings.url, {
        method: SummaryApi.adminUpdateSettings.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileExpirationDays
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('File settings updated successfully');
      } else {
        toast.error(data.message || 'Failed to update file settings');
      }
    } catch (error) {
      console.error('Error saving file settings:', error);
      toast.error('Failed to update file settings');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <TriangleMazeLoader />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">File Storage Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File Expiration Period (days)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max="365"
              value={fileExpirationDays}
              onChange={(e) => setFileExpirationDays(Number(e.target.value))}
              className="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-600">days</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Files uploaded by users will be automatically deleted after this period. This setting is not visible to users.
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </button>
          
          <button
            onClick={fetchSettings}
            disabled={loading || saving}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFileSettings;