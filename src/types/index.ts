export type UserType = 'visitante' | 'negocio';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
  avatar?: string;
  telefone?: string;
  propriedadeNome?: string;
}

export type BusinessCategory = 'pousada' | 'restaurante' | 'propriedade_rural';

export interface Negocio {
  id: string;
  nome: string;
  categoria: BusinessCategory;
  categoriaLabel: string;
  descricao: string;
  descricaoCompleta?: string;
  endereco: string;
  bairroDistrito: string;
  contato: string;
  emailContato: string;
  horarios: string;
  id_dono: string;
  nome_dono: string;
  lat: number;
  lng: number;
  preco_medio: string;
  capacidade: number;
  fotos: string[];
  destaques: string[];
  nota: number;
  num_avaliacoes: number;
  distanciaKm?: number;
}

export type AttractionType = 'atrativo' | 'evento';
export type AttractionCategory = 'natureza' | 'rural' | 'cultural' | 'gastronomia';

export interface AtrativoEvento {
  id: string;
  titulo: string;
  tipo: AttractionType;
  categoria: AttractionCategory;
  categoriaLabel: string;
  descricao: string;
  local: string;
  lat: number;
  lng: number;
  data_inicio?: string;
  data_fim?: string;
  horario?: string;
  foto: string;
  preco?: string;
  id_negocio_relacionado?: string;
  distanciaKm?: number;
}

export interface ParadaRoteiro {
  ordem: number;
  titulo: string;
  tipo: 'atrativo' | 'negocio' | 'mirante' | 'refeicao';
  id_referencia?: string;
  descricao: string;
  horario_sugerido: string;
  lat?: number;
  lng?: number;
}

export interface Roteiro {
  id: string;
  titulo: string;
  subtitulo: string;
  duracao: string;
  dificuldade: 'Leve' | 'Moderada' | 'Fácil para Família';
  descricao: string;
  foto: string;
  foco: string;
  paradas: ParadaRoteiro[];
}

export type ReservaStatus = 'pendente' | 'confirmada' | 'recusada' | 'concluida';

export interface Reserva {
  id: string;
  id_usuario: string;
  nome_usuario: string;
  email_usuario: string;
  telefone_usuario: string;
  id_negocio: string;
  nome_negocio: string;
  categoria_negocio: BusinessCategory;
  data: string;
  hora?: string;
  numero_pessoas: number;
  tipo_reserva: 'hospedagem' | 'almoco_colonial' | 'visita_guiada' | 'experiencia_rural';
  observacoes?: string;
  status: ReservaStatus;
  data_criacao: string;
  tem_avaliacao?: boolean;
}

export interface Avaliacao {
  id: string;
  id_reserva: string;
  id_usuario: string;
  nome_usuario: string;
  id_negocio: string;
  nome_negocio: string;
  nota: number; // 1 to 5
  comentario: string;
  data: string;
  resposta_dono?: string;
  data_resposta?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FilterState {
  categoria: string;
  tipoItem: 'todos' | 'pousada' | 'restaurante' | 'propriedade_rural' | 'atrativo' | 'evento';
  busca: string;
  raioKm: number; // 0 means any
  notaMinima: number;
  ordenarPor: 'recomendados' | 'proximidade' | 'melhor_nota' | 'nome';
  dataEvento?: string;
}

export interface StatsResponse {
  totalNegocios: number;
  totalAtrativos: number;
  totalRoteiros: number;
  totalReservas: number;
  reservasConfirmadas: number;
  totalAvaliacoes: number;
  mediaGeralNotas: number;
}

export const CANOINHAS_CENTER: Coordinates = {
  lat: -26.1772,
  lng: -50.3900,
};

