'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Product, Category} from '@/types'; 
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, Upload, X } from 'lucide-react'; 
import axios from 'axios';


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prix: 0,
    prix_tva: 0,
    categorie: '',
    photo: '',
    principales_caracteristiques: '',  
    disponible: true 
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
    fetchCategories();
  }, [products, searchTerm, selectedCategory]);

  const API_URL = 'https://radah-gamesclub.com/server/api/product/';
  const API_URL_CATEGORIES = 'https://radah-gamesclub.com/server/api/categorie/'; // Django endpoint

  const fetchCategories = async () => {
      const res = await axios.get(API_URL_CATEGORIES); 
      setCategories(res.data);
    };

  const fetchProducts = async () => {
    try { 
      const response = await axios.get(API_URL);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Erreur fetch produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.categorie === selectedCategory);
    }
    setFilteredProducts(filtered);
  };

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

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const prixHT = Number(formData.prix);
      const prixTTC = Math.round(prixHT + (prixHT * 18) / 100);

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('prix', prixHT.toString());
      data.append('prix_tva', prixTTC.toString());
      data.append('categorie', formData.categorie);
      data.append('principales_caracteristiques', formData.principales_caracteristiques);
      data.append('disponible', formData.disponible ? 'true' : 'false');

      // image ?
      if (selectedImage) {
        data.append('photo', selectedImage);
      }

      console.log(data)

      if (editingProduct) {
        await axios.put(`${API_URL}${editingProduct.id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(API_URL, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Erreur enregistrement produit:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      prix: product.prix,
      prix_tva: product.prix_tva,
      categorie: product.categorie,
      principales_caracteristiques: product.principales_caracteristiques,
      disponible: product.disponible,
      photo: product.photo
    }); 
  
    setImagePreview(product.photo || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer ce produit ?')) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        fetchProducts();
      } catch (error) {
        console.error('Erreur suppression produit:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      prix: 0,
      prix_tva: 0,
      categorie: '',
      principales_caracteristiques: '',
      disponible: true,
      photo: ''
    });
    setEditingProduct(null);
    setShowForm(false);
    setSelectedImage(null);
    setImagePreview('');
  };

  if (loading) {
    return (
      <AdminLayout title="Produits">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Produits">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Nouveau Produit
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {showForm && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[700px] max-h-[90vh] overflow-y-auto relative">
      {/* Bouton fermer */}
      <button
        onClick={resetForm}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>

      <h2 className="text-xl font-semibold mb-4">
        {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du produit
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
            Catégorie
          </label>
          <select
            value={formData.categorie}
            onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix HT</label>
          <input
            type="number"
            step="0.01"
            value={formData.prix}
            onChange={(e) =>
              setFormData({ ...formData, prix: parseInt(e.target.value) })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prix TTC</label>
          <input
            disabled
            type="number"
            value={(formData.prix * 18) / 100 + formData.prix}
            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Principales caractéristiques
          </label>
          <textarea
            value={formData.principales_caracteristiques}
            onChange={(e) =>
              setFormData({
                ...formData,
                principales_caracteristiques: e.target.value,
              })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {(imagePreview || formData.photo) && (
            <img
              src={imagePreview || formData.photo}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="disponible"
            checked={formData.disponible}
            onChange={(e) =>
              setFormData({ ...formData, disponible: e.target.checked })
            }
            className="mr-2"
          />
          <label htmlFor="disponible" className="text-sm font-medium text-gray-700">
            Produit disponible
          </label>
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {editingProduct ? 'Modifier' : 'Créer'}
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
  </div>
)}


        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.photo && (
                        <img
                          className="h-16 w-16 rounded-lg mr-4 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          src={product.photo}
                          alt={product.name}
                          onClick={() => openImageModal(product.photo)}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                        {product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    HT: {product.prix} FCFA
                    <br />
                    <span className="text-red-500">TTC: {product.prix_tva} FCFA</span>
                   
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.categorie}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.disponible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.disponible ? (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Disponible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Indisponible
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit className="h-4 w-4" /> 
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-4xl max-h-screen overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Image du produit</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <img
                src={modalImage}
                alt="Product"
                className="max-w-full max-h-96 object-contain mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
