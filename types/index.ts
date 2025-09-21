export interface Profil {
  id: string;
  name: string;
  photo: string;
  description: string;
  color: string;
  time: string;
  additionale: string;
  can_win: string;
  ordre: number;
  active: boolean;
  createdAt: Date;
}

export interface News {
  id: string;
  author: string;
  title: string;
  subtitle: string;
  post: string;
  photo: string;
  visible: boolean;
  movie: boolean;
  add_date: Date;
}

export interface Landing {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  photo: string;
}

export interface Transaction {
  id: string;
  user: string;
  add_date: Date;
  piece: number;
  status: string;
  montant: number;
  transaction_type: string;
  profil: string;
  reseau: string;
}

export interface Question {
  id: string;
  question: string;
  propo_une: string;
  propo_deux: string;
  propo_trois: string;
  propo_quatre: string;
  propo_cinq: string;
  response: string;
  custom_date: string,
  activation: string,
}

export interface UserResponse {
  id: string;
  user_id: string;
  user_name: string;
  response: string;
  answered_at: string;
}

export interface Product {
  id: any;
  name: string;
  description: string;
  prix: number;
  prix_tva: number;
  categorie: string;
  photo: string;
  principales_caracteristiques: string;
  disponible: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  photo: string;
  description: string;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  password: string;
}
