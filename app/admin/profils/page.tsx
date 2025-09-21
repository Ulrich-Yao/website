'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import axios from "axios";
import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

interface Categorie {
  id: number;
  name: string;
}

interface Profil {
  id?: number;
  name: string;
  photo?: File | null | string; // string si déjà existante
  description: string;
  color: string;
  time: string;
  additionnale: string;
  can_win: number[];
  ordre: number;
  active: boolean;
}

export default function ProfilsPage() {
  const [profils, setProfils] = useState<Profil[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [formData, setFormData] = useState<Profil>({
    name: "",
    description: "",
    color: "",
    time: "",
    additionnale: "",
    can_win: [],
    ordre: 0,
    active: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const API_URL = 'http://radah-gamesclub.com/server/api/profil/';
  const API_URL_CATEGORIES = 'http://radah-gamesclub.com/server/api/categorie/';

  useEffect(() => {
    fetchProfils();
    fetchCategories();
  }, []);

  const fetchProfils = async () => {
    const res = await axios.get(API_URL);
    setProfils(res.data);
  };

  const fetchCategories = async () => {
    const res = await axios.get(API_URL_CATEGORIES);
    setCategories(res.data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type} = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSelectChange = (selected: any) => {
    setFormData({ ...formData, can_win: selected.map((cat: any) => cat.value) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "can_win") {
        (value as number[]).forEach((id) => data.append("can_win", id.toString()));
      } else if (value !== null) {
        data.append(key, value as any);
      }
    });

    if (editingId) {
      await axios.put(`${API_URL}${editingId}/`, data);
    } else {
      await axios.post(API_URL, data);
    }

    setFormData({
      name: "",
      description: "",
      color: "",
      time: "",
      additionnale: "",
      can_win: [],
      ordre: 0,
      active: true,
    });
    setEditingId(null);
    setPreview(null);
    setShowModal(false);
    fetchProfils();
  };

  const handleEdit = (profil: Profil) => {
    setFormData({ ...profil });
    setEditingId(profil.id || null);
    setPreview(typeof profil.photo === "string" ? profil.photo : null); // si image déjà en base
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`${API_URL}${id}/`);
    fetchProfils();
  };

  return (
    <AdminLayout title="Gestion des Profils">
      <div className="p-4">
        {/* Bouton ouvrir modal */}
        <button
          onClick={() => { setShowModal(true); setEditingId(null); }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Nouveau Profil
        </button>

        {/* Liste */}
        <h2 className="text-xl font-bold mt-6">Liste des Profils</h2>
        <ul className="mt-2 space-y-2">
          {profils.map((profil) => (
            <li key={profil.id} className="border p-2 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {profil.photo && (
                  <img
                    src={
                      typeof profil.photo === "string"
                        ? profil.photo
                        : URL.createObjectURL(profil.photo)
                    }
                    alt="profil"
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <span>{profil.name}</span>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(profil)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(profil.id!)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full  max-w-lg relative">
            {/* Close */}
            <button
              onClick={() => { setShowModal(false); setPreview(null); }}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Modifier Profil" : "Créer Profil"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="d-flex">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  value={formData.name}
                  onChange={handleChange}
                  className="border p-2 w-full"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur
                </label>
                <input
                  type="color"
                  name="color"
                  placeholder="Couleur"
                  value={formData.color}
                  onChange={handleChange}
                  className="border p-2 w-full h-14"
                />
              </div>

              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 w-full"
              />

              <input
                type="text"
                name="time"
                placeholder="Temps"
                value={formData.time}
                onChange={handleChange}
                className="border p-2 w-full"
              />
              <input
                type="text"
                name="additionnale"
                placeholder="Additionnelle"
                value={formData.additionnale}
                onChange={handleChange}
                className="border p-2 w-full"
              />

              <div> 
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordre
                </label>
              <input
                type="number"
                name="ordre"
                placeholder="Ordre"
                value={formData.ordre}
                onChange={handleChange} 
                className="border p-2 w-full"
              />

              </div>
                
              {/* Upload + preview */}
              <input type="file" onChange={handleFileChange} className="border p-2 w-full" />
              {preview && (
                <img
                  src={preview}
                  alt="aperçu"
                  className="w-32 h-32 object-cover rounded"
                />
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <span>Actif</span>
              </label>

              <Select
                isMulti
                options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                value={categories
                  .filter((cat) => formData.can_win.includes(cat.id))
                  .map((cat) => ({ value: cat.id, label: cat.name }))}
                onChange={handleSelectChange}
              />

              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {editingId ? "Mettre à jour" : "Créer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
