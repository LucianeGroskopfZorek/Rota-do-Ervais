/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Negocio,
  AtrativoEvento,
  Roteiro,
  Reserva,
  Avaliacao,
  Coordinates,
  FilterState,
  StatsResponse,
  Usuario,
  CANOINHAS_CENTER
} from './types/index.ts';
import { api } from './services/api.ts';
import { InteractiveMap } from './components/InteractiveMap.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { ReviewModal } from './components/ReviewModal.tsx';
import { DetailModal } from './components/DetailModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { RoteirosView } from './components/RoteirosView.tsx';
import { OdsSection } from './components/OdsSection.tsx';

import {
  Compass,
  MapPin,
  Search,
  Star,
  Calendar,
  Filter,
  Navigation,
  Building2,
  Heart,
  ChevronRight,
  ShieldCheck,
  Check,
  Clock,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function App() {
  // Navigation View
  const [currentView, setCurrentView] = useState<
    'explorar' | 'mapa' | 'roteiros' | 'dashboard' | 'ods'
  >('explorar');

  // Active user simulation (Carla as tourist, Nicolas/Luciane as business owners)
  const [currentUser, setCurrentUser] = useState<Usuario>({
    id: 'user_carla',
    nome: 'Carla Silveira Mendes',
    email: 'carla.mendes@email.com',
    tipo: 'visitante',
    telefone: '(41) 99823-4410',
  });

  // Data states
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [atrativos, setAtrativos] = useState<AtrativoEvento[]>([]);
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [userReservas, setUserReservas] = useState<Reserva[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // User coordinates state
  const [userCoords, setUserCoords] = useState<Coordinates>(CANOINHAS_CENTER);
  const [isUsingGps, setIsUsingGps] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    categoria: 'todos',
    tipoItem: 'todos',
    busca: '',
    raioKm: 0,
    notaMinima: 0,
    ordenarPor: 'recomendados',
  });

  // Modals state
  const [selectedNegocioForDetail, setSelectedNegocioForDetail] = useState<Negocio | null>(null);
  const [selectedNegocioForBooking, setSelectedNegocioForBooking] = useState<Negocio | null>(null);
  const [selectedNegocioForReview, setSelectedNegocioForReview] = useState<Negocio | null>(null);
  const [selectedDetailReviews, setSelectedDetailReviews] = useState<Avaliacao[]>([]);

  // Load initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [negList, atrList, rotList, statsData, resList] = await Promise.all([
        api.getNegocios({
          lat: userCoords.lat,
          lng: userCoords.lng,
          raio: filters.raioKm,
          nota_min: filters.notaMinima,
          busca: filters.busca,
        }),
        api.getAtrativosEventos({
          lat: userCoords.lat,
          lng: userCoords.lng,
          busca: filters.busca,
        }),
        api.getRoteiros(),
        api.getStats(),
        api.getReservas({ id_usuario: currentUser.id }),
      ]);

      setNegocios(negList);
      setAtrativos(atrList);
      setRoteiros(rotList);
      setStats(statsData);
      setUserReservas(resList);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userCoords, filters.raioKm, filters.notaMinima, currentUser.id]);

  // Request user GPS
  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGpsStatusMessage('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setGpsStatusMessage('Obtendo sinal GPS...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setIsUsingGps(true);
        setGpsStatusMessage('Localização GPS ativada!');
        setTimeout(() => setGpsStatusMessage(null), 3000);
      },
      (err) => {
        console.warn('Erro ao obter GPS, mantendo centro de Canoinhas:', err);
        // Fallback to Canoinhas Center with friendly feedback
        setUserCoords(CANOINHAS_CENTER);
        setIsUsingGps(false);
        setGpsStatusMessage('GPS indisponível. Usando centro de Canoinhas SC como referência.');
        setTimeout(() => setGpsStatusMessage(null), 3500);
      },
      { timeout: 7000 }
    );
  };

  const handleResetToCanoinhas = () => {
    setUserCoords(CANOINHAS_CENTER);
    setIsUsingGps(false);
    setGpsStatusMessage('Referência redefinida para o centro de Canoinhas SC.');
    setTimeout(() => setGpsStatusMessage(null), 3000);
  };

  // Open detail modal with reviews
  const handleOpenDetail = async (negocio: Negocio) => {
    setSelectedNegocioForDetail(negocio);
    try {
      const details = await api.getNegocioById(negocio.id);
      setSelectedDetailReviews(details.avaliacoes);
    } catch (err) {
      setSelectedDetailReviews([]);
    }
  };

  // Switch demo user
  const handleSwitchUserRole = (tipo: 'visitante' | 'negocio') => {
    if (tipo === 'visitante') {
      setCurrentUser({
        id: 'user_carla',
        nome: 'Carla Silveira Mendes',
        email: 'carla.mendes@email.com',
        tipo: 'visitante',
        telefone: '(41) 99823-4410',
      });
      setCurrentView('explorar');
    } else {
      setCurrentUser({
        id: 'user_nicolas',
        nome: 'Nicolas Duma',
        email: 'contato@valedasaraucarias.com.br',
        tipo: 'negocio',
        telefone: '(47) 99122-3841',
        propriedadeNome: 'Pousada Rural Vale das Araucárias',
      });
      setCurrentView('dashboard');
    }
  };

  // Filtered & Sorted items
  const filteredNegocios = useMemo(() => {
    let list = [...negocios];

    if (filters.categoria !== 'todos') {
      list = list.filter((n) => n.categoria === filters.categoria);
    }

    if (filters.busca.trim() !== '') {
      const q = filters.busca.toLowerCase();
      list = list.filter(
        (n) =>
          n.nome.toLowerCase().includes(q) ||
          n.descricao.toLowerCase().includes(q) ||
          n.endereco.toLowerCase().includes(q) ||
          n.destaques.some((d) => d.toLowerCase().includes(q))
      );
    }

    if (filters.notaMinima > 0) {
      list = list.filter((n) => n.nota >= filters.notaMinima);
    }

    if (filters.raioKm > 0) {
      list = list.filter((n) => (n.distanciaKm || 0) <= filters.raioKm);
    }

    // Sort
    if (filters.ordenarPor === 'proximidade') {
      list.sort((a, b) => (a.distanciaKm || 0) - (b.distanciaKm || 0));
    } else if (filters.ordenarPor === 'melhor_nota') {
      list.sort((a, b) => b.nota - a.nota);
    }

    return list;
  }, [negocios, filters]);

  const filteredAtrativos = useMemo(() => {
    let list = [...atrativos];
    if (filters.categoria !== 'todos') {
      list = list.filter((a) => a.categoria === filters.categoria);
    }
    if (filters.busca.trim() !== '') {
      const q = filters.busca.toLowerCase();
      list = list.filter(
        (a) =>
          a.titulo.toLowerCase().includes(q) ||
          a.descricao.toLowerCase().includes(q) ||
          a.local.toLowerCase().includes(q)
      );
    }
    return list;
  }, [atrativos, filters]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans">
      {/* 
        Top Bar Contract:
        [Brand title, one line] — [4–5 nav links, 1–2 word labels, single-line] — [1 primary action]
      */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E1D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setCurrentView('explorar')}
            className="text-xl font-bold tracking-tight text-[#1B4332] font-display whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity cursor-pointer text-left"
          >
            ROTA DOS ERVAIS
          </button>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setCurrentView('explorar')}
              className={`hover:text-[#1B4332] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'explorar' ? 'text-[#1B4332] font-bold border-b-2 border-[#2D6A4F] pb-1' : ''
              }`}
            >
              Explorar Ofertas
            </button>
            <button
              onClick={() => setCurrentView('roteiros')}
              className={`hover:text-[#1B4332] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'roteiros' ? 'text-[#1B4332] font-bold border-b-2 border-[#2D6A4F] pb-1' : ''
              }`}
            >
              Roteiros Sugeridos
            </button>
            <button
              onClick={() => setCurrentView('mapa')}
              className={`hover:text-[#1B4332] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'mapa' ? 'text-[#1B4332] font-bold border-b-2 border-[#2D6A4F] pb-1' : ''
              }`}
            >
              Mapa & Proximidade
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`hover:text-[#1B4332] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'dashboard' ? 'text-[#1B4332] font-bold border-b-2 border-[#2D6A4F] pb-1' : ''
              }`}
            >
              Painel do Produtor
            </button>
            <button
              onClick={() => setCurrentView('ods')}
              className={`hover:text-[#1B4332] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'ods' ? 'text-[#1B4332] font-bold border-b-2 border-[#2D6A4F] pb-1' : ''
              }`}
            >
              Cunho Social & ODS
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser.tipo === 'visitante' ? (
              <button
                onClick={() => handleSwitchUserRole('negocio')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2D6A4F] rounded-xl hover:bg-[#1B4332] transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Área do Empreendedor</span>
              </button>
            ) : (
              <button
                onClick={() => handleSwitchUserRole('visitante')}
                className="px-4 py-2 text-xs font-semibold text-[#1B4332] bg-[#FAF9F5] border border-[#2D6A4F] rounded-xl hover:bg-[#2D6A4F]/10 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Modo Visitante (Carla)</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around border-t border-[#E5E1D8] bg-white py-2 px-1 text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => setCurrentView('explorar')}
            className={`py-1 px-2 ${currentView === 'explorar' ? 'text-[#1B4332] font-bold' : ''}`}
          >
            Explorar
          </button>
          <button
            onClick={() => setCurrentView('roteiros')}
            className={`py-1 px-2 ${currentView === 'roteiros' ? 'text-[#1B4332] font-bold' : ''}`}
          >
            Roteiros
          </button>
          <button
            onClick={() => setCurrentView('mapa')}
            className={`py-1 px-2 ${currentView === 'mapa' ? 'text-[#1B4332] font-bold' : ''}`}
          >
            Mapa
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`py-1 px-2 ${currentView === 'dashboard' ? 'text-[#1B4332] font-bold' : ''}`}
          >
            Produtor
          </button>
          <button
            onClick={() => setCurrentView('ods')}
            className={`py-1 px-2 ${currentView === 'ods' ? 'text-[#1B4332] font-bold' : ''}`}
          >
            ODS
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* HERO SECTION (Displayed on Explorar & Mapa) */}
        {(currentView === 'explorar' || currentView === 'mapa') && (
          <div className="relative rounded-3xl overflow-hidden bg-[#1B4332] text-white shadow-md border border-[#1B4332]">
            {/* Background Photography with measured scrim */}
            <div className="absolute inset-0">
              <img
                src="/src/assets/images/hero_canoinhas_rural_1794441252491.jpg"
                alt="Paisagem rural de Canoinhas SC com floresta de Araucárias e colinas verdes"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332] via-[#1B4332]/85 to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-4">
              <div className="text-xs uppercase tracking-wider text-[#A3E635] font-semibold">
                Planalto Norte Catarinense · Canoinhas SC
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display leading-[1.15] text-balance">
                Turismo Rural, Sabores Coloniais e Trilhas Ecológicas
              </h1>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
                Conecte-se a pousadas aconchegantes em fazendas centenárias, almoços com a autêntica quirera tropeira e cucas alemãs, e cachoeiras preservadas em Canoinhas e região.
              </p>

              {/* Geolocation & Filter Search Bar */}
              <div className="pt-2">
                <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-white/20 text-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Buscar por pousada, quirera, chimarrão, cachoeira..."
                        value={filters.busca}
                        onChange={(e) => setFilters({ ...filters, busca: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#FAF9F5] border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#2D6A4F]"
                      />
                    </div>

                    {/* Geolocation Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={isUsingGps ? handleResetToCanoinhas : handleRequestGps}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                          isUsingGps
                            ? 'bg-blue-600 text-white'
                            : 'bg-[#FAF9F5] text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Filtrar pontos por proximidade a partir de você"
                      >
                        <Navigation className={`w-3.5 h-3.5 ${isUsingGps ? 'animate-pulse' : ''}`} />
                        <span>{isUsingGps ? 'GPS Ativo' : 'Usar Meu GPS'}</span>
                      </button>

                      <button
                        onClick={() => setCurrentView(currentView === 'mapa' ? 'explorar' : 'mapa')}
                        className="px-3.5 py-2 bg-[#2D6A4F] text-white rounded-xl text-xs font-semibold hover:bg-[#1B4332] transition-colors whitespace-nowrap shrink-0"
                      >
                        {currentView === 'mapa' ? 'Ver em Lista' : 'Ver no Mapa'}
                      </button>
                    </div>
                  </div>

                  {/* Secondary filters row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 text-xs">
                    {/* Category tabs */}
                    <div className="flex flex-wrap items-center gap-1">
                      {[
                        { id: 'todos', label: 'Todos' },
                        { id: 'pousada', label: 'Pousadas' },
                        { id: 'restaurante', label: 'Restaurantes Coloniais' },
                        { id: 'propriedade_rural', label: 'Fazendas & Ecoturismo' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setFilters({ ...filters, categoria: cat.id })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            filters.categoria === cat.id
                              ? 'bg-[#1B4332] text-white font-semibold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Distance & Rating filters */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <span>Raio:</span>
                        <select
                          value={filters.raioKm}
                          onChange={(e) =>
                            setFilters({ ...filters, raioKm: parseInt(e.target.value) })
                          }
                          className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                        >
                          <option value="0">Qualquer distância</option>
                          <option value="5">Até 5 km</option>
                          <option value="15">Até 15 km</option>
                          <option value="30">Até 30 km</option>
                          <option value="50">Até 50 km</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1 text-slate-600">
                        <span>Nota:</span>
                        <select
                          value={filters.notaMinima}
                          onChange={(e) =>
                            setFilters({ ...filters, notaMinima: parseFloat(e.target.value) })
                          }
                          className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                        >
                          <option value="0">Todas as notas</option>
                          <option value="4.5">★ 4.5 ou mais</option>
                          <option value="4.8">★ 4.8 ou mais</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1 text-slate-600">
                        <span>Ordenar:</span>
                        <select
                          value={filters.ordenarPor}
                          onChange={(e) =>
                            setFilters({ ...filters, ordenarPor: e.target.value as any })
                          }
                          className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
                        >
                          <option value="recomendados">Recomendados</option>
                          <option value="proximidade">Mais Próximos</option>
                          <option value="melhor_nota">Melhor Nota</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPS status feedback */}
                {gpsStatusMessage && (
                  <div className="mt-2 text-xs text-[#A3E635] flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>{gpsStatusMessage}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 1: EXPLORAR LIST */}
        {currentView === 'explorar' && (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1B4332] font-display">
                  Pontos de Interesse & Estabelecimentos em Canoinhas
                </h2>
                <div className="text-xs text-slate-500 mt-0.5">
                  Exibindo {filteredNegocios.length} locais disponíveis para reserva direta
                  {filters.raioKm > 0 && ` em um raio de até ${filters.raioKm} km`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('mapa')}
                  className="px-3.5 py-1.5 bg-white border border-[#E5E1D8] text-xs font-semibold text-[#1B4332] rounded-xl hover:bg-[#FAF9F5] transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>Explorar no Mapa</span>
                </button>
              </div>
            </div>

            {/* Negócios Grid */}
            {filteredNegocios.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#E5E1D8] text-slate-500 space-y-2">
                <Compass className="w-8 h-8 mx-auto text-slate-400" />
                <div className="font-semibold text-sm text-slate-700">
                  Nenhum estabelecimento encontrado com os filtros atuais.
                </div>
                <div className="text-xs">
                  Tente aumentar o raio de distância ou limpar os termos de busca.
                </div>
                <button
                  onClick={() =>
                    setFilters({
                      categoria: 'todos',
                      tipoItem: 'todos',
                      busca: '',
                      raioKm: 0,
                      notaMinima: 0,
                      ordenarPor: 'recomendados',
                    })
                  }
                  className="mt-2 text-xs font-semibold text-[#2D6A4F] hover:underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNegocios.map((neg) => (
                  <div
                    key={neg.id}
                    className="bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="relative h-48 w-full bg-[#1B4332] overflow-hidden">
                        <img
                          src={neg.fotos[0]}
                          alt={neg.nome}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                          <span className="bg-white/95 backdrop-blur-xs text-[#1B4332] font-semibold px-2.5 py-1 rounded-lg shadow-xs">
                            {neg.categoriaLabel}
                          </span>
                          <span className="bg-black/60 backdrop-blur-xs text-white font-mono px-2 py-0.5 rounded-lg text-[11px] flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{neg.nota.toFixed(1)}</span>
                            <span className="text-white/70">({neg.num_avaliacoes})</span>
                          </span>
                        </div>

                        {/* Distance at bottom of image */}
                        {neg.distanciaKm !== undefined && (
                          <div className="absolute bottom-2.5 left-3 text-white text-xs font-medium flex items-center gap-1 drop-shadow-sm">
                            <Navigation className="w-3 h-3 text-[#A3E635]" />
                            <span>{neg.distanciaKm} km de você</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-[#1B4332] font-display group-hover:text-[#2D6A4F] transition-colors">
                            {neg.nome}
                          </h3>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{neg.bairroDistrito}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {neg.descricao}
                        </p>

                        {/* Destaques list */}
                        <div className="space-y-1 pt-1 text-[11px] text-slate-600">
                          {neg.destaques.slice(0, 2).map((dest, i) => (
                            <div key={i} className="flex items-center gap-1.5 truncate">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F] shrink-0" />
                              <span className="truncate">{dest}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">
                            Preço sugerido
                          </div>
                          <div className="text-xs font-bold text-[#1B4332] truncate max-w-[130px]">
                            {neg.preco_medio}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(neg)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#1B4332] bg-[#FAF9F5] hover:bg-[#2D6A4F]/10 border border-[#2D6A4F] rounded-xl transition-colors"
                          >
                            Detalhes
                          </button>
                          <button
                            onClick={() => setSelectedNegocioForBooking(neg)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-xl transition-colors shadow-xs"
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Atrativos e Eventos Regionais Section (RF01) */}
            <div className="pt-6 border-t border-[#E5E1D8]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#1B4332] font-display">
                    Atrativos Naturais & Eventos Tradicionais de Canoinhas
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mirantes, patrimônio histórico do Contestado e celebrações da erva-mate.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredAtrativos.map((atr) => (
                  <div
                    key={atr.id}
                    className="bg-white rounded-2xl border border-[#E5E1D8] overflow-hidden shadow-xs p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-[11px] font-bold uppercase text-[#854D0E]">
                          {atr.categoriaLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {atr.distanciaKm !== undefined ? `${atr.distanciaKm} km de você` : ''}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 font-display mb-1">
                        {atr.titulo}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {atr.descricao}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 truncate max-w-[170px]">
                        <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                        <span className="truncate">{atr.local}</span>
                      </span>
                      <span className="font-semibold text-[#1B4332]">{atr.preco || 'Gratuito'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MAPA INTERATIVO & GEOLOCALIZACAO */}
        {currentView === 'mapa' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1B4332] font-display">
                  Mapa Turístico e Geolocalização de Canoinhas SC
                </h2>
                <p className="text-xs text-slate-500">
                  Visualize distâncias reais entre os morros, distritos rurais (Marcílio Dias, Taunay, Valinhos) e a sede municipal.
                </p>
              </div>
              <div className="text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-[#E5E1D8]">
                <strong>Referência ativa:</strong>{' '}
                {isUsingGps ? 'Coordenadas do seu dispositivo GPS' : 'Centro Histórico de Canoinhas (-26.1772, -50.3900)'}
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <InteractiveMap
              negocios={filteredNegocios}
              atrativos={filteredAtrativos}
              userLocation={userCoords}
              radiusKm={filters.raioKm}
              onSelectItem={(type, id) => {
                if (type === 'negocio') {
                  const found = negocios.find((n) => n.id === id);
                  if (found) handleOpenDetail(found);
                }
              }}
            />

            {/* Quick Filter Strip under Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredNegocios.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="p-4 bg-white rounded-xl border border-[#E5E1D8] shadow-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{n.nome}</h4>
                    <div className="text-[11px] text-slate-500">{n.distanciaKm} km de distância · ★ {n.nota.toFixed(1)}</div>
                  </div>
                  <button
                    onClick={() => handleOpenDetail(n)}
                    className="px-3 py-1.5 bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg hover:bg-[#1B4332] whitespace-nowrap"
                  >
                    Ver no Mapa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ROTEIROS SUGERIDOS */}
        {currentView === 'roteiros' && (
          <RoteirosView
            roteiros={roteiros}
            negocios={negocios}
            onSelectNegocio={(id) => {
              const found = negocios.find((n) => n.id === id);
              if (found) handleOpenDetail(found);
            }}
            onOpenBooking={(neg) => setSelectedNegocioForBooking(neg)}
          />
        )}

        {/* VIEW 4: ADMIN DASHBOARD */}
        {currentView === 'dashboard' && (
          <AdminDashboard negocios={negocios} onDataUpdated={fetchData} />
        )}

        {/* VIEW 5: ODS & PROJETO TÉCNICO */}
        {currentView === 'ods' && <OdsSection stats={stats} />}
      </main>

      {/* MODALS */}
      {selectedNegocioForBooking && (
        <BookingModal
          negocio={selectedNegocioForBooking}
          isOpen={true}
          onClose={() => setSelectedNegocioForBooking(null)}
          onSuccess={(reserva) => {
            fetchData();
          }}
          currentUser={currentUser}
        />
      )}

      {selectedNegocioForReview && (
        <ReviewModal
          negocio={selectedNegocioForReview}
          isOpen={true}
          onClose={() => setSelectedNegocioForReview(null)}
          onSuccess={() => {
            fetchData();
          }}
          userReservas={userReservas}
          currentUser={currentUser}
        />
      )}

      {selectedNegocioForDetail && (
        <DetailModal
          negocio={selectedNegocioForDetail}
          avaliacoes={selectedDetailReviews}
          isOpen={true}
          onClose={() => setSelectedNegocioForDetail(null)}
          onOpenBooking={(neg) => {
            setSelectedNegocioForDetail(null);
            setSelectedNegocioForBooking(neg);
          }}
          onOpenReview={(neg) => {
            setSelectedNegocioForDetail(null);
            setSelectedNegocioForReview(neg);
          }}
        />
      )}

      {/* FOOTER */}
      <footer className="mt-16 bg-[#163527] text-white border-t border-[#1B4332] pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-white/80">
            <div className="space-y-2">
              <span className="text-lg font-bold font-display text-white tracking-tight">
                ROTA DOS ERVAIS
              </span>
              <p className="leading-relaxed">
                Plataforma de turismo rural, gastronômico e ecológico desenvolvida para valorizar os pequenos negócios e produtores de Canoinhas SC.
              </p>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Identificação Acadêmica
              </div>
              <ul className="space-y-1">
                <li>UC6: Prototipação Rápida com IA | 2026</li>
                <li>Dupla: Luciane Grosskopf Zorek & Nicolas Duma</li>
                <li>Eixo: Turismo, Hospitalidade e Lazer</li>
                <li>Município: Canoinhas - Santa Catarina</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Compromissos ODS & Leis
              </div>
              <ul className="space-y-1">
                <li>ODS 8: Trabalho Decente e Crescimento Local</li>
                <li>ODS 11: Salvaguarda Cultural e Natural</li>
                <li>ODS 12: Produção e Consumo Responsáveis</li>
                <li>Conformidade ECA Digital & LGPD</li>
              </ul>
            </div>

            <div>
              <div className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Segmentos Contemplados
              </div>
              <ul className="space-y-1">
                <li>Hospedagem em Fazendas & Chalés Rústicos</li>
                <li>Gastronomia Típica Tropeira & Café Colonial</li>
                <li>Cultura da Erva-Mate & Chimarrão Tradicional</li>
                <li>Trilhas das Cachoeiras & Cicloturismo</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-center text-xs text-white/50">
            &copy; 2026 Rota dos Ervais · Canoinhas SC. Todos os direitos reservados aos produtores e à comunidade local.
          </div>
        </div>
      </footer>
    </div>
  );
}
