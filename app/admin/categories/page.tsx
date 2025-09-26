'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Category } from '@/types'; 
import { Plus, Edit, Trash2, Search, Upload, X } from 'lucide-react';
import axios from 'axios';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    description: '',
  });

  const API_URL = 'https://radah-gamesclub.com/server/api/categorie/'; // Django endpoint  

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm]);

  /** 🔹 Récupération des catégories */
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get<Category[]>(API_URL);
      setCategories(data);
      console.log(data)
    } catch (error) {
      console.error('Erreur de récupération des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Filtrage */
  const filterCategories = () => {
    let filtered = categories;
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredCategories(filtered);
  };

  /** 🔹 Upload image */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  /** 🔹 Submit (Create ou Update) */
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (selectedImage) {
      // 🔹 Si image uploadée
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('photo', selectedImage);

      if (editingCategory) {
        // PATCH plutôt que PUT
        await axios.patch(`${API_URL}${editingCategory.id}/`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(API_URL, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
    } else {
      // 🔹 Si aucune image uploadée → JSON simple
      const payload = {
        name: formData.name,
        description: formData.description,
        photo: formData.photo,
      };

      if (editingCategory) {
        await axios.patch(`${API_URL}${editingCategory.id}/`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
    }

    fetchCategories();
    resetForm();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
};

  /** 🔹 Edit */
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      photo: category.photo,
      description: category.description
    });
    setImagePreview(category.photo || '');
    setShowForm(true);
  };

  const openImageModal = (imageUrl: string) => { setModalImage(imageUrl); setShowImageModal(true); };

  /** 🔹 Delete */
  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchCategories();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  /** 🔹 Reset form */
  const resetForm = () => {
    setFormData({ name: '', photo: '', description: '' });
    setEditingCategory(null);
    setShowForm(false);
    setSelectedImage(null);
    setImagePreview('');
  };

  if (loading) {
    return (
      <AdminLayout title="Catégories">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Catégories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center"> 
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Nouvelle Catégorie
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-600">
            {filteredCategories.length} catégorie{filteredCategories.length !== 1 ? 's' : ''} trouvée{filteredCategories.length !== 1 ? 's' : ''}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la catégorie
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Lots inclus
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image de la catégorie
                </label>
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
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  
                  {/* Image Preview */}
                  {(imagePreview || formData.photo) && (
                    <div className="relative">
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

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editingCategory ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {category.photo && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={category.photo}
                    alt={category.name}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openImageModal(category.photo)}
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                  {category.description}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune catégorie trouvée</p>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-4xl max-h-screen overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Image de la catégorie</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <img
                src={modalImage}
                alt="Category"
                className="max-w-full max-h-96 object-contain mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout> 
  );
}
