import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Download, 
  Calendar, 
  User, 
  MapPin, 
  Camera,
  Search,
  Filter,
  ArrowLeft,
  X
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const ScanViewer = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  useEffect(() => {
    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await api.get('/scans');
      setScans(response.data.scans);
    } catch (error) {
      console.error('Error fetching scans:', error);
      toast.error('Failed to load scans');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (scanId) => {
    try {
      const response = await api.get(`/scans/${scanId}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `scan-${scanId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDF report downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF report');
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesSearch = 
      scan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scan.scanType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterRegion || scan.region === filterRegion;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Scans</h1>
        <p className="text-gray-600">View and analyze patient dental scan images</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, ID, or scan type..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="input-field pl-10"
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                <option value="Frontal">Frontal</option>
                <option value="Upper Arch">Upper Arch</option>
                <option value="Lower Arch">Lower Arch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scans Grid */}
      {filteredScans.length === 0 ? (
        <div className="card text-center py-12">
          <Camera className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No scans found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {scans.length === 0 
              ? 'No scans have been uploaded yet.' 
              : 'Try adjusting your search or filter criteria.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScans.map((scan) => (
            <div key={scan.id} className="card hover:shadow-lg transition-shadow duration-200">
              {/* Image Thumbnail */}
              <div className="relative mb-4">
                <img
                  src={scan.thumbnailUrl}
                  alt={`Scan for ${scan.patientName}`}
                  className="w-full h-48 object-cover rounded-lg bg-gray-100"
                />
                <button
                  onClick={() => setSelectedScan(scan)}
                  className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center"
                >
                  <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                </button>
              </div>

              {/* Scan Details */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-500" />
                    {scan.patientName}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {scan.patientId}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Camera className="h-4 w-4 mr-2" />
                    {scan.scanType}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {scan.region}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(scan.uploadDate)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => setSelectedScan(scan)}
                    className="flex-1 btn-primary text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(scan.id)}
                    className="flex-1 btn-secondary text-sm"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedScan(null)}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Scan Details - {selectedScan.patientName}
                  </h3>
                  <button
                    onClick={() => setSelectedScan(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image */}
                  <div>
                    <img
                      src={selectedScan.imageUrl}
                      alt={`Full scan for ${selectedScan.patientName}`}
                      className="w-full h-96 object-contain bg-gray-50 rounded-lg border"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{selectedScan.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ID:</span>
                          <span className="font-medium">{selectedScan.patientId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scan Type:</span>
                          <span className="font-medium">{selectedScan.scanType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Region:</span>
                          <span className="font-medium">{selectedScan.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Upload Date:</span>
                          <span className="font-medium">{formatDate(selectedScan.uploadDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Uploaded By:</span>
                          <span className="font-medium">{selectedScan.uploadedBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => handleDownloadPDF(selectedScan.id)}
                        className="w-full btn-primary"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanViewer;
