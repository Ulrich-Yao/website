'use client';

import AdminLayout from '@/components/AdminLayout';
import { Users, FileText, CreditCard, HelpCircle, TrendingUp, Activity } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      name: 'Utilisateurs',
      value: '12',
      icon: Users,
      color: 'bg-blue-500',
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Jeux joués',
      value: '8',
      icon: FileText,
      color: 'bg-green-500',
      change: '+2.02%',
      changeType: 'positive',
    },
    {
      name: 'Transactions',
      value: '156',
      icon: CreditCard,
      color: 'bg-yellow-500',
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      name: 'Parrainage/Piece',
      value: '24',
      icon: HelpCircle,
      color: 'bg-purple-500',
      change: '-1.39%',
      changeType: 'negative',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bienvenue dans votre espace administrateur
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Gérez facilement tous vos contenus et données
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                          <span className="sr-only">
                            {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                          </span>
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Actions Rapides
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="#"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                    <Users className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Listes Utilisateurs
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Créer, modifier et supprimer les profils utilisateurs
                  </p>
                </div>
              </a>

              <a
                href="#"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                    <FileText className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                   Listes des Jeux
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Gerez tous les jeux
                  </p>
                </div>
              </a>

              <a
                href="#"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                    <CreditCard className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Listes des Transactions
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Suivre les transactions financières
                  </p>
                </div>
              </a>

              <a
                href="#"
                className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div>
                  <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                    <HelpCircle className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Parrainage/Rang
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Gerez les parrainage
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
