'use client'; 

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, Eye, EyeOff, Film, Upload, X, Video, Image, Search, FileText } from 'lucide-react';
import { News } from '@/types';

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [modalMedia, setModalMedia] = useState('');
  const [modalMediaType, setModalMediaType] = useState<'image' | 'video'>('image');
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    //author: '',
    title: '', 
    subtitle: '',
    post: '',
    photo: '',
    visible: true,
    movie: false,
  });

  const API_URL = 'http://radah-gamesclub.com/server/api/news/';

  const fetchNews = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des actualités:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Détection type média
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));

      if (file.type.startsWith('image/')) setFileType('image');
      else if (file.type.startsWith('video/')) setFileType('video');
    }
  };

  const isVideoUrl = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext));
  };

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.photo;

      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile);

        const imageResponse = await fetch(`${API_URL}`, {
          method: 'POST',
          body: imageFormData, 
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          imageUrl = imageData.imageUrl;
        }
      }

      const newsData = { ...formData, photo: imageUrl };
      const url = editingNews ? `${API_URL}${editingNews.id}/` : `${API_URL}`;
      const method = editingNews ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsData),
      });

      if (response.ok) {
        fetchNews();
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      //author: newsItem.author,
      title: newsItem.title,
      subtitle: newsItem.subtitle,
      post: newsItem.post,
      photo: newsItem.photo,
      visible: newsItem.visible,
      movie: newsItem.movie,
    });
    setFilePreview(newsItem.photo || '');
    if (newsItem.photo) setFileType(isVideoUrl(newsItem.photo) ? 'video' : 'image');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;
    try {
      const response = await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      if (response.ok) fetchNews();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      //author: '',
      title: '',
      subtitle: '',
      post: '',
      photo: '',
      visible: true,
      movie: false,
    });
    setEditingNews(null);
    setShowForm(false);
    setSelectedFile(null);
    setFilePreview('');
    setFileType(null);
  };

  const filteredNews = news.filter(newsItem =>
    newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    newsItem.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Gestion des Actualités">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Actualités">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Actualités</h1>
              <p className="text-gray-600">Gérez les actualités et articles de votre site</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle Actualité</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher par titre, sous-titre ou auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">
                {editingNews ? 'Modifier l\'Actualité' : 'Nouvelle Actualité'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                  <textarea
                    value={formData.post}
                    onChange={(e) => setFormData({...formData, post: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo/Vidéo</label>
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">Images: PNG, JPG, GIF | Vidéos: MP4, WebM, OGG jusqu'à 50MB</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,video/*"
                          onChange={handleMediaUpload}
                        />
                      </label>
                    </div>
                    
                    {/* URL Input */}
                    <div className="text-center text-sm text-gray-500">ou</div>
                    <input
                      type="url"
                      placeholder="URL de l'image ou vidéo"
                      value={formData.photo}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData({...formData, photo: url});
                        if (url) {
                          setFileType(isVideoUrl(url) ? 'video' : 'image');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    {/* Media Preview */}
                    {(filePreview || formData.photo) && (
                      <div className="relative inline-block">
                        {fileType === 'video' ? (
                          <video
                            src={filePreview || formData.photo}
                            className="w-32 h-32 object-cover rounded-lg border"
                            controls
                            muted
                          >
                            Votre navigateur ne supporte pas la lecture vidéo.
                          </video>
                        ) : (
                          <img
                            src={filePreview || formData.photo}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        )}
                        <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full p-1">
                          {fileType === 'video' ? <Video size={12} /> : <Image size={12} />}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFilePreview('');
                            setSelectedFile(null);
                            setFormData({ ...formData, photo: '' });
                            setFileType(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="visible"
                      checked={formData.visible}
                      onChange={(e) => setFormData({...formData, visible: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="visible" className="ml-2 block text-sm text-gray-900">
                      Visible
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="movie"
                      checked={formData.movie}
                      onChange={(e) => setFormData({...formData, movie: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="movie" className="ml-2 block text-sm text-gray-900">
                      Contient une vidéo
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {editingNews ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* News List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Liste des Actualités ({filteredNews.length})
            </h3>
          </div>
          
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune actualité</h3>
              <p className="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle actualité.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actualité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Auteur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredNews.map((newsItem) => (
                    <tr key={newsItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {newsItem.photo && (
                            <div className="relative mr-4">
                              {isVideoUrl(newsItem.photo) ? (
                                <video
                                  src={newsItem.photo}
                                  className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                  onClick={() => {
                                    setModalMedia(newsItem.photo);
                                    setModalMediaType('video');
                                    setShowMediaModal(true);
                                  }}
                                  muted
                                >
                                  Votre navigateur ne supporte pas la lecture vidéo.
                                </video>
                              ) : (
                                <img
                                  src={newsItem.photo}
                                  alt={newsItem.title}
                                  className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                                  onClick={() => {
                                    setModalMedia(newsItem.photo);
                                    setModalMediaType('image');
                                    setShowMediaModal(true);
                                  }}
                                />
                              )}
                              <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-0.5">
                                {isVideoUrl(newsItem.photo) ? <Video size={10} /> : <Image size={10} />}
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{newsItem.title}</div>
                            {newsItem.subtitle && (
                              <div className="text-sm text-gray-500">{newsItem.subtitle}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {newsItem.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(newsItem.add_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            newsItem.visible 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {newsItem.visible ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Visible
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Masqué
                              </>
                            )}
                          </span>
                          {newsItem.movie && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              <Film className="h-3 w-3 mr-1" />
                              Vidéo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(newsItem)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(newsItem.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Media Modal */}
        {showMediaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative max-w-4xl max-h-screen p-4">
              {modalMediaType === 'video' ? (
                <video
                  src={modalMedia}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  controls
                  autoPlay
                >
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              ) : (
                <img
                  src={modalMedia}
                  alt="Média agrandi"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              )}
              <button
                onClick={() => setShowMediaModal(false)}
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
