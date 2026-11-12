import {
  Negocio,
  AtrativoEvento,
  Roteiro,
  Reserva,
  Avaliacao,
  Usuario,
  StatsResponse
} from '../types/index.ts';

const API_BASE = '/api';

export const api = {
  // Negócios
  async getNegocios(params?: {
    categoria?: string;
    busca?: string;
    lat?: number;
    lng?: number;
    raio?: number;
    nota_min?: number;
  }): Promise<Negocio[]> {
    const searchParams = new URLSearchParams();
    if (params?.categoria && params.categoria !== 'todos') searchParams.append('categoria', params.categoria);
    if (params?.busca) searchParams.append('busca', params.busca);
    if (params?.lat !== undefined) searchParams.append('lat', params.lat.toString());
    if (params?.lng !== undefined) searchParams.append('lng', params.lng.toString());
    if (params?.raio && params.raio > 0) searchParams.append('raio', params.raio.toString());
    if (params?.nota_min && params.nota_min > 0) searchParams.append('nota_min', params.nota_min.toString());

    const res = await fetch(`${API_BASE}/negocios?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Falha ao buscar estabelecimentos');
    return res.json();
  },

  async getNegocioById(id: string): Promise<{ negocio: Negocio; avaliacoes: Avaliacao[] }> {
    const res = await fetch(`${API_BASE}/negocios/${id}`);
    if (!res.ok) throw new Error('Falha ao carregar detalhes do estabelecimento');
    return res.json();
  },

  async updateNegocio(id: string, data: Partial<Negocio>): Promise<Negocio> {
    const res = await fetch(`${API_BASE}/negocios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao atualizar dados do estabelecimento');
    return res.json();
  },

  async createNegocio(data: Omit<Negocio, 'id' | 'nota' | 'num_avaliacoes'>): Promise<Negocio> {
    const res = await fetch(`${API_BASE}/negocios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao cadastrar estabelecimento');
    return res.json();
  },

  // Atrativos & Eventos
  async getAtrativosEventos(params?: {
    tipo?: string;
    categoria?: string;
    busca?: string;
    lat?: number;
    lng?: number;
  }): Promise<AtrativoEvento[]> {
    const searchParams = new URLSearchParams();
    if (params?.tipo && params.tipo !== 'todos') searchParams.append('tipo', params.tipo);
    if (params?.categoria && params.categoria !== 'todos') searchParams.append('categoria', params.categoria);
    if (params?.busca) searchParams.append('busca', params.busca);
    if (params?.lat !== undefined) searchParams.append('lat', params.lat.toString());
    if (params?.lng !== undefined) searchParams.append('lng', params.lng.toString());

    const res = await fetch(`${API_BASE}/atrativos-eventos?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Falha ao buscar atrativos e eventos');
    return res.json();
  },

  async createAtrativoEvento(data: Omit<AtrativoEvento, 'id'>): Promise<AtrativoEvento> {
    const res = await fetch(`${API_BASE}/atrativos-eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao criar atrativo ou evento');
    return res.json();
  },

  // Roteiros
  async getRoteiros(): Promise<Roteiro[]> {
    const res = await fetch(`${API_BASE}/roteiros`);
    if (!res.ok) throw new Error('Falha ao carregar roteiros sugeridos');
    return res.json();
  },

  async getRoteiroById(id: string): Promise<Roteiro> {
    const res = await fetch(`${API_BASE}/roteiros/${id}`);
    if (!res.ok) throw new Error('Falha ao carregar roteiro');
    return res.json();
  },

  // Reservas
  async getReservas(params?: { id_usuario?: string; id_negocio?: string }): Promise<Reserva[]> {
    const searchParams = new URLSearchParams();
    if (params?.id_usuario) searchParams.append('id_usuario', params.id_usuario);
    if (params?.id_negocio) searchParams.append('id_negocio', params.id_negocio);

    const res = await fetch(`${API_BASE}/reservas?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Falha ao buscar reservas');
    return res.json();
  },

  async createReserva(data: Omit<Reserva, 'id' | 'status' | 'data_criacao' | 'tem_avaliacao'>): Promise<Reserva> {
    const res = await fetch(`${API_BASE}/reservas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao solicitar reserva');
    }
    return res.json();
  },

  async updateReservaStatus(id: string, status: Reserva['status']): Promise<Reserva> {
    const res = await fetch(`${API_BASE}/reservas/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Falha ao atualizar status da reserva');
    return res.json();
  },

  // Avaliações
  async getAvaliacoes(params?: { id_negocio?: string; id_usuario?: string }): Promise<Avaliacao[]> {
    const searchParams = new URLSearchParams();
    if (params?.id_negocio) searchParams.append('id_negocio', params.id_negocio);
    if (params?.id_usuario) searchParams.append('id_usuario', params.id_usuario);

    const res = await fetch(`${API_BASE}/avaliacoes?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Falha ao buscar avaliações');
    return res.json();
  },

  async createAvaliacao(data: {
    id_reserva: string;
    id_usuario: string;
    nome_usuario: string;
    id_negocio: string;
    nota: number;
    comentario: string;
  }): Promise<Avaliacao> {
    const res = await fetch(`${API_BASE}/avaliacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha ao enviar avaliação');
    }
    return res.json();
  },

  async responderAvaliacao(id: string, resposta: string): Promise<Avaliacao> {
    const res = await fetch(`${API_BASE}/avaliacoes/${id}/resposta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resposta }),
    });
    if (!res.ok) throw new Error('Falha ao enviar resposta da avaliação');
    return res.json();
  },

  // Usuários
  async getUsuarios(): Promise<Usuario[]> {
    const res = await fetch(`${API_BASE}/usuarios`);
    if (!res.ok) throw new Error('Falha ao carregar usuários');
    return res.json();
  },

  // Indicadores
  async getStats(): Promise<StatsResponse> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Falha ao carregar estatísticas');
    return res.json();
  },
};
