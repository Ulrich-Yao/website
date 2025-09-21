'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { Landing } from '@/types';
import axios from 'axios';

export default function LandingPage() {
  const [landings, setLandings] = useState<Landing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLanding, setEditingLanding] = useState<Landing | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    photo: ''
  });
  // 🔹 URL de ton API Django
  const API_URL = 'http://radah-gamesclub.com/server/api/landing/';

  useEffect(() => {
    fetchLandings();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openImageModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setShowImageModal(true);
  };

  // 🔹 Récupération des landings
  const fetchLandings = async () => {
    try {
      const response = await axios.get(API_URL);
      setLandings(response.data);
    } catch (error) {
      console.error('Error fetching landings:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Création ou édition
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;

      if (selectedImage) {
        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('description', formData.description);
        
        if(selectedImage){
          data.append('photo', selectedImage);
        }

        if (editingLanding) {
          response = await axios.put(`${API_URL}${editingLanding.id}/`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          response = await axios.post(API_URL, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      } else {
        if (editingLanding) {
          response = await axios.put(`${API_URL}${editingLanding.id}/`, formData);
        } else {
          response = await axios.post(API_URL, formData);
        }
      }

      if (response.status === 200 || response.status === 201) {
        fetchLandings();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving landing:', error);
    }
  };

  // 🔹 Édition
  const handleEdit = (landing: Landing) => {
    setEditingLanding(landing);
    setFormData({
      title: landing.title,
      subtitle: landing.subtitle,
      description: landing.description,
      photo: landing.photo
    });
    setImagePreview(landing.photo || '');
    setShowForm(true);
  };

  // 🔹 Suppression
  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette landing page ?')) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchLandings();
      } catch (error) {
        console.error('Error deleting landing:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      photo: ''
    });
    setEditingLanding(null);
    setShowForm(false);
    setSelectedImage(null);
    setImagePreview('');
  };

  return (
    <AdminLayout title="Gestion des Landing Pages">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Liste des Landing Pages</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Landing Page
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">
                {editingLanding ? 'Modifier la Landing Page' : 'Nouvelle Landing Page'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sous-titre</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                    
                    {/* URL Input */}
                    <div className="text-center text-sm text-gray-500">ou</div>
                    <input
                      type="url"
                      placeholder="URL de l'image"
                      className="form-input"
                      value={formData.photo}
                      onChange={(e) => setFormData({...formData, photo: e.target.value})}
                    />
                    
                    {/* Image Preview */}
                    {(imagePreview || formData.photo) && (
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || formData.photo}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setSelectedImage(null);
                            setFormData({ ...formData, photo: '' });
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingLanding ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Landings List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-6 text-center">Chargement...</div>
          ) : landings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Aucune landing page trouvée</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {landings.map((landing) => (
                <li key={landing.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {landing.photo && (
                        <img
                          src={landing.photo}
                          alt={landing.title}
                          className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openImageModal(landing.photo)}
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{landing.title}</h3>
                        {landing.subtitle && (
                          <p className="text-sm text-gray-600 mt-1">{landing.subtitle}</p>
                        )}
                        {landing.description && (
                          <p className="text-sm text-gray-700 mt-2">
                            {landing.description.substring(0, 200)}...
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(landing)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(landing.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
            <div className="relative max-w-4xl max-h-screen p-4">
              <img
                src={modalImage}
                alt="Image agrandie"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
