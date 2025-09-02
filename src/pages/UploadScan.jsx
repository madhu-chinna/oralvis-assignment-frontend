import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  User, 
  Hash, 
  Camera, 
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle,
  FileImage,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const UploadScan = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPG, PNG)');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileChange(event);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error('Please select a scan image');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('patientName', data.patientName);
      formData.append('patientId', data.patientId);
      formData.append('scanType', data.scanType);
      formData.append('region', data.region);
      formData.append('scanImage', selectedFile);

      const response = await api.post('/scans/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Scan uploaded successfully!');
      reset();
      setSelectedFile(null);
      setPreview(null);
      navigate('/dashboard');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-3 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:shadow-md group"
              >
                <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-slate-900 group-hover:-translate-x-1 transition-all duration-200" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Upload Patient Scan
                </h1>
                <p className="text-lg text-slate-600">
                  Upload dental scan images with patient details securely
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Shield className="h-4 w-4" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Zap className="h-4 w-4" />
                <span>Secure Upload</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="xl:col-span-2">
          <div className="card-elevated">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Patient Information</h3>
                <p className="text-sm text-slate-600">Enter patient details and scan information</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Name */}
                <div className="form-group">
                  <label htmlFor="patientName" className="form-label">
                    <User className="inline h-4 w-4 mr-2" />
                    Patient Name
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    className="input-field"
                    placeholder="Enter patient's full name"
                    {...register('patientName', { 
                      required: 'Patient name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                  />
                  {errors.patientName && (
                    <p className="error-text">
                      <AlertCircle className="h-4 w-4" />
                      {errors.patientName.message}
                    </p>
                  )}
                </div>

                {/* Patient ID */}
                <div className="form-group">
                  <label htmlFor="patientId" className="form-label">
                    <Hash className="inline h-4 w-4 mr-2" />
                    Patient ID
                  </label>
                  <input
                    id="patientId"
                    type="text"
                    className="input-field"
                    placeholder="Enter unique patient identifier"
                    {...register('patientId', { 
                      required: 'Patient ID is required',
                      minLength: { value: 3, message: 'Patient ID must be at least 3 characters' }
                    })}
                  />
                  {errors.patientId && (
                    <p className="error-text">
                      <AlertCircle className="h-4 w-4" />
                      {errors.patientId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Scan Type */}
                <div className="form-group">
                  <label htmlFor="scanType" className="form-label">
                    <Camera className="inline h-4 w-4 mr-2" />
                    Scan Type
                  </label>
                  <input
                    id="scanType"
                    type="text"
                    className="input-field"
                    placeholder="e.g., RGB, Intraoral, Panoramic"
                    {...register('scanType', { 
                      required: 'Scan type is required',
                      minLength: { value: 2, message: 'Scan type must be at least 2 characters' }
                    })}
                  />
                  {errors.scanType && (
                    <p className="error-text">
                      <AlertCircle className="h-4 w-4" />
                      {errors.scanType.message}
                    </p>
                  )}
                </div>

                {/* Region */}
                <div className="form-group">
                  <label htmlFor="region" className="form-label">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Region
                  </label>
                  <select
                    id="region"
                    className="input-field"
                    {...register('region', { required: 'Region is required' })}
                  >
                    <option value="">Select region</option>
                    <option value="Frontal">Frontal</option>
                    <option value="Upper Arch">Upper Arch</option>
                    <option value="Lower Arch">Lower Arch</option>
                  </select>
                  {errors.region && (
                    <p className="error-text">
                      <AlertCircle className="h-4 w-4" />
                      {errors.region.message}
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="form-group">
                <label className="form-label">
                  <FileImage className="inline h-4 w-4 mr-2" />
                  Scan Image
                </label>
                <div 
                  className="mt-2 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('scanImage').click()}
                >
                  <div className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900 mb-1">
                        {selectedFile ? 'File Selected' : 'Upload Scan Image'}
                      </p>
                      <p className="text-sm text-slate-600 mb-4">
                        {selectedFile ? 'Click to change file' : 'Drag and drop or click to browse'}
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                        <span>PNG, JPG</span>
                        <span>•</span>
                        <span>Max 10MB</span>
                        <span>•</span>
                        <span>High Quality</span>
                      </div>
                    </div>
                    <input
                      id="scanImage"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                {selectedFile && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium text-emerald-900">{selectedFile.name}</p>
                          <p className="text-xs text-emerald-700">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
                      >
                        <X className="h-4 w-4 text-emerald-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {uploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="loading-spinner"></div>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Upload Scan</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Preview & Guidelines */}
        <div className="space-y-6">
          {/* Image Preview */}
          <div className="card-elevated">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Image Preview</h3>
                <p className="text-sm text-slate-600">Preview your scan</p>
              </div>
            </div>
            
            {preview ? (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Scan preview"
                    className="w-full h-64 object-contain bg-slate-50 rounded-xl border border-slate-200 group-hover:shadow-lg transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-xl transition-colors duration-300"></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">File Name:</span>
                    <span className="font-medium text-slate-900 truncate ml-2">{selectedFile?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">File Size:</span>
                    <span className="font-medium text-slate-900">{(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">File Type:</span>
                    <span className="font-medium text-slate-900">{selectedFile?.type}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No image selected</p>
                  <p className="text-xs text-slate-400 mt-1">Upload an image to see preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines */}
          <div className="card-elevated">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upload Guidelines</h3>
                <p className="text-sm text-slate-600">Best practices for quality scans</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { icon: Camera, text: 'Ensure the image is clear and well-lit', color: 'text-blue-600' },
                { icon: FileImage, text: 'Supported formats: JPG, PNG', color: 'text-emerald-600' },
                { icon: Shield, text: 'Maximum file size: 10MB', color: 'text-purple-600' },
                { icon: CheckCircle, text: 'Double-check patient information', color: 'text-green-600' },
                { icon: MapPin, text: 'Select the correct anatomical region', color: 'text-orange-600' }
              ].map((guideline, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <guideline.icon className={`h-4 w-4 ${guideline.color}`} />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{guideline.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadScan;
