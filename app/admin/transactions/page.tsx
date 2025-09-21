'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { Transaction } from '@/types';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [formData, setFormData] = useState({
    user: '',
    piece: 0,
    status: 'pending',
    montant: 0,
    transaction_type: 'credit',
    profil: '',
    reseau: ''
  });

  const statusOptions = ['pending', 'completed', 'failed', 'cancelled'];
  const typeOptions = ['credit', 'debit', 'transfer', 'payment'];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTransaction ? `/api/transactions/${editingTransaction.id}` : '/api/transactions';
      const method = editingTransaction ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchTransactions();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      user: transaction.user,
      piece: transaction.piece,
      status: transaction.status,
      montant: transaction.montant,
      transaction_type: transaction.transaction_type,
      profil: transaction.profil,
      reseau: transaction.reseau
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      user: '',
      piece: 0,
      status: 'pending',
      montant: 0,
      transaction_type: 'credit',
      profil: '',
      reseau: ''
    });
    setEditingTransaction(null);
    setShowForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AdminLayout title="Gestion des Transactions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Liste des Transactions</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Transaction
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h3 className="text-lg font-medium mb-4">
                {editingTransaction ? 'Modifier la Transaction' : 'Nouvelle Transaction'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Utilisateur</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={formData.user}
                      onChange={(e) => setFormData({...formData, user: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Profil</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.profil}
                      onChange={(e) => setFormData({...formData, profil: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Montant</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="form-input"
                      value={formData.montant}
                      onChange={(e) => setFormData({...formData, montant: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pièces</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.piece}
                      onChange={(e) => setFormData({...formData, piece: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de Transaction</label>
                    <select
                      className="form-input"
                      value={formData.transaction_type}
                      onChange={(e) => setFormData({...formData, transaction_type: e.target.value})}
                    >
                      {typeOptions.map(type => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                    <select
                      className="form-input"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Réseau</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.reseau}
                      onChange={(e) => setFormData({...formData, reseau: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTransaction ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-6 text-center">Chargement...</div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Aucune transaction trouvée</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{transaction.user}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.montant.toFixed(2)} €
                          </p>
                          {transaction.piece > 0 && (
                            <p className="text-sm text-gray-500">
                              {transaction.piece} pièces
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          {transaction.profil && (
                            <p className="text-xs text-gray-400">Profil: {transaction.profil}</p>
                          )}
                          {transaction.reseau && (
                            <p className="text-xs text-gray-400">Réseau: {transaction.reseau}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.add_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
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
      </div>
    </AdminLayout>
  );
}
