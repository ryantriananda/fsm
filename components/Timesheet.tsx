import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Calendar, CheckCircle, XCircle, Sparkles, MapPin, Plus, X, Loader2,
  Camera, Image, Upload, Eye, Trash2
} from 'lucide-react';
import { TimesheetEntry } from '../types';
import { timesheetService } from '../services/supabaseService';
import { supabase } from '../services/supabase';

const Timesheet: React.FC = () => {
  const [cleaningLogs, setCleaningLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimesheets();
  }, []);

  const loadTimesheets = async () => {
    setLoading(true);
    try {
      const data = await timesheetService.getAll();
      setCleaningLogs(data);
    } catch (err) {
      console.error('Error loading timesheets:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewPhotoModal, setViewPhotoModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employeeName: '',
    date: new Date().toISOString().split('T')[0],
    project: '',
    task: '',
    hours: 8 as number | string,
    photos: [] as string[],
    notes: ''
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats calculation
  const totalHours = cleaningLogs.reduce((acc, curr) => acc + (curr.hours || 0), 0);
  const pendingCount = cleaningLogs.filter(d => d.status === 'Submitted').length;
  const coverageMetric = '100% Area';


  const handleOpenModal = () => {
    setFormData({
      employeeName: '',
      date: new Date().toISOString().split('T')[0],
      project: '',
      task: '',
      hours: 8,
      photos: [],
      notes: ''
    });
    setIsModalOpen(true);
  };

  // Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: string[] = [...formData.photos];

    for (const file of Array.from(files)) {
      try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `timesheet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('timesheet-photos')
          .upload(fileName, file);

        if (error) {
          console.error('Upload error:', error);
          // Fallback: use local URL for demo
          const localUrl = URL.createObjectURL(file);
          newPhotos.push(localUrl);
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('timesheet-photos')
            .getPublicUrl(fileName);
          newPhotos.push(urlData.publicUrl);
        }
      } catch (err) {
        console.error('Upload failed:', err);
        // Fallback to local URL
        const localUrl = URL.createObjectURL(file);
        newPhotos.push(localUrl);
      }
    }

    setFormData({ ...formData, photos: newPhotos });
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove photo
  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  // Take photo from camera
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry = {
      employee_name: formData.employeeName,
      date: formData.date,
      project: formData.project,
      task: formData.task,
      hours_worked: Number(formData.hours),
      status: 'Submitted',
      photos: formData.photos,
      notes: formData.notes
    };

    try {
      await timesheetService.create(newEntry);
      await loadTimesheets();
    } catch (err) {
      // Fallback for demo
      setCleaningLogs([{ id: Date.now(), ...newEntry, employeeName: formData.employeeName, hours: Number(formData.hours) }, ...cleaningLogs]);
    }
    
    setIsModalOpen(false);
  };


  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Cleaning Service Timesheet</h2>
          <p className="text-gray-500 text-sm mt-1">Track cleaning staff shifts, zones, and live photo reports.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-md transition-colors"
          >
            <Plus size={16} />
            Log Cleaning Shift
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Hours (Daily)</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalHours}h</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Clock size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Pending Approval</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{pendingCount}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Calendar size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Area Coverage</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{coverageMetric}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <MapPin size={24} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-700">Shift Logs</h3>
          <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100 flex items-center gap-1">
            <Sparkles size={12} />
            Cleaning Dept
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Zone / Area</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Photos</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cleaningLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{entry.employeeName || entry.employee_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{entry.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400"/>
                      <span className="font-medium text-gray-900">{entry.project}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{entry.task}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{entry.hours || entry.hours_worked}h</td>
                  <td className="px-6 py-4">
                    {entry.photos && entry.photos.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setViewPhotoModal(entry.photos[0])}
                          className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs hover:bg-blue-100"
                        >
                          <Image size={12} />
                          {entry.photos.length} foto
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {entry.status === 'Approved' && <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase"><CheckCircle size={14}/> Approved</span>}
                    {entry.status === 'Rejected' && <span className="flex items-center gap-1 text-rose-600 text-xs font-bold uppercase"><XCircle size={14}/> Rejected</span>}
                    {entry.status === 'Submitted' && <span className="flex items-center gap-1 text-blue-600 text-xs font-bold uppercase"><Clock size={14}/> Submitted</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Log Cleaning Shift</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                    <input required type="text" value={formData.employeeName}
                      onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                      placeholder="e.g., Budi Santoso" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input required type="date" value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zone / Area</label>
                    <select required value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none bg-white">
                      <option value="">Select Zone</option>
                      <option value="Lobby & Reception">Lobby & Reception</option>
                      <option value="Restrooms Lt. 1-3">Restrooms Lt. 1-3</option>
                      <option value="Meeting Rooms">Meeting Rooms</option>
                      <option value="Pantry & Breakroom">Pantry & Breakroom</option>
                      <option value="Outdoor Area">Outdoor Area</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                    <input required type="number" min="0" step="0.5" value={formData.hours}
                      onChange={(e) => setFormData({...formData, hours: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Activity</label>
                  <input required type="text" value={formData.task}
                    onChange={(e) => setFormData({...formData, task: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    placeholder="e.g., Deep Clean, Mopping, etc." />
                </div>

                {/* Photo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Camera size={16} className="inline mr-1" />
                    Live Report Photos
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input type="file" ref={fileInputRef} accept="image/*" multiple
                      onChange={handlePhotoUpload} className="hidden" />
                    
                    <div className="flex gap-2 justify-center mb-3">
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium">
                        <Upload size={16} />
                        Upload Foto
                      </button>
                      <button type="button" onClick={handleCameraCapture}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium">
                        <Camera size={16} />
                        Ambil Foto
                      </button>
                    </div>

                    {uploading && (
                      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </div>
                    )}

                    {/* Photo Preview */}
                    {formData.photos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img src={photo} alt={`Photo ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg border" />
                            <button type="button" onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.photos.length === 0 && !uploading && (
                      <p className="text-center text-gray-400 text-sm">
                        Upload foto sebagai bukti pengerjaan
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                    rows={2} placeholder="Additional notes..." />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium shadow-md">
                  Submit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Photo Modal */}
      {viewPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setViewPhotoModal(null)}>
          <div className="max-w-3xl max-h-[90vh]">
            <img src={viewPhotoModal} alt="Photo" className="max-w-full max-h-[90vh] rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Timesheet;
