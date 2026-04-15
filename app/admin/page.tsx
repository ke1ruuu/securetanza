"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';

interface CrimeFormData {
  barangay: string;
  date: string;
  time: string;
  crimeType: string;
}

const TANZA_BARANGAYS = [
  'Bagtas', 'Biga', 'Bucal', 'Buenavista', 'Capipisa',
  'Daang Amaya I', 'Daang Amaya II', 'Daang Amaya III',
  'Gonzalez', 'Halayhay', 'Lambingan', 'Mulawin',
  'Paradahan I', 'Paradahan II', 'Pob. I (Barangay I)',
  'Pob. II (Barangay II)', 'Pob. III (Barangay III)', 'Pob. IV (Barangay IV)',
  'Sahud-Ulan', 'San Juan I', 'San Juan II', 'Santol', 'Talisay', 'Tres Cruses'
];

const CRIME_TYPES = [
  'Theft', 'Robbery', 'Assault', 'Vandalism', 'Drug-related',
  'Domestic Violence', 'Traffic Violation', 'Fraud', 'Burglary', 'Public Disturbance'
];

export default function AdminPage() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<CrimeFormData>({
    barangay: '',
    date: '',
    time: '',
    crimeType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [recentCrimes, setRecentCrimes] = useState<any[]>([]);

  useEffect(() => {
    fetchRecentCrimes();
  }, []);

  const fetchRecentCrimes = async () => {
    try {
      const response = await fetch('/api/crimes?limit=10');
      const data = await response.json();
      if (data.success) {
        setRecentCrimes(data.data);
      }
    } catch (error) {
      console.error('Error fetching recent crimes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/crimes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date + 'T' + formData.time).toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Crime incident added successfully!' });
        setFormData({ barangay: '', date: '', time: '', crimeType: '' });
        fetchRecentCrimes(); // Refresh the list
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add crime incident' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CrimeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`min-h-screen p-8 transition-colors duration-700 ${
      theme === 'dark' ? 'bg-[#020617] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className={`text-3xl font-black uppercase tracking-widest ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Crime Data Admin
          </h1>
          <p className="text-slate-500 text-base mt-2">Add new crime incidents to the database</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Crime Form */}
          <Card className={`${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <CardHeader>
              <CardTitle className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Add New Crime Incident
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Barangay
                  </label>
                  <select
                    value={formData.barangay}
                    onChange={(e) => handleInputChange('barangay', e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border text-base ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="">Select Barangay</option>
                    {TANZA_BARANGAYS.map(barangay => (
                      <option key={barangay} value={barangay}>{barangay}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border text-base ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border text-base ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Crime Type
                  </label>
                  <select
                    value={formData.crimeType}
                    onChange={(e) => handleInputChange('crimeType', e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border text-base ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="">Select Crime Type</option>
                    {CRIME_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm font-bold ${
                    message.type === 'success' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {message.text}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 text-base"
                >
                  {isSubmitting ? 'Adding...' : 'Add Crime Incident'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recent Crimes */}
          <Card className={`${
            theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <CardHeader>
              <CardTitle className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Recent Crime Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentCrimes.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No crime incidents found</p>
                ) : (
                  recentCrimes.map((crime) => (
                    <div
                      key={crime.id}
                      className={`p-3 rounded-lg border ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-base">{crime.crimeType}</p>
                          <p className="text-sm text-slate-500">{crime.barangay}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">
                            {new Date(crime.date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-slate-500">{crime.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}