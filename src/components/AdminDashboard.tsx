import React, { useState, useEffect } from 'react';
import { Negocio, Reserva, Avaliacao, AtrativoEvento } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Building2,
  CalendarCheck,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Plus,
  MessageSquare,
  Sparkles,
  Phone,
  MapPin,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  negocios: Negocio[];
  onDataUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  negocios,
  onDataUpdated,
}) => {
  const [selectedNegocioId, setSelectedNegocioId] = useState<string>(
    negocios[0]?.id || ''
  );

  const selectedNegocio = negocios.find((n) => n.id === selectedNegocioId) || negocios[0];

  const [activeTab, setActiveTab] = useState<'reservas' | 'perfil' | 'avaliacoes' | 'novo_evento'>('reservas');
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Profile Edit State
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [descricaoCompleta, setDescricaoCompleta] = useState('');
  const [horarios, setHorarios] = useState('');
  const [contato, setContato] = useState('');
  const [emailContato, setEmailContato] = useState('');
  const [precoMedio, setPrecoMedio] = useState('');
  const [capacidade, setCapacidade] = useState(20);
  const [destaquesStr, setDestaquesStr] = useState('');

  // Reply state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // New Event / Offering state
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novoTipo, setNovoTipo] = useState<'atrativo' | 'evento'>('evento');
  const [novaCategoria, setNovaCategoria] = useState<'natureza' | 'rural' | 'cultural' | 'gastronomia'>('gastronomia');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoPreco, setNovoPreco] = useState('Consulte');
  const [novaDataInicio, setNovaDataInicio] = useState('');
  const [novaDataFim, setNovaDataFim] = useState('');

  // Load business data when selected negocio changes
  useEffect(() => {
    if (selectedNegocio) {
      setNome(selectedNegocio.nome);
      setDescricao(selectedNegocio.descricao);
      setDescricaoCompleta(selectedNegocio.descricaoCompleta || selectedNegocio.descricao);
      setHorarios(selectedNegocio.horarios);
      setContato(selectedNegocio.contato);
      setEmailContato(selectedNegocio.emailContato);
      setPrecoMedio(selectedNegocio.preco_medio);
      setCapacidade(selectedNegocio.capacidade);
      setDestaquesStr(selectedNegocio.destaques.join(', '));
      loadBusinessData(selectedNegocio.id);
    }
  }, [selectedNegocioId, negocios]);

  const loadBusinessData = async (negocioId: string) => {
    setLoading(true);
    try {
      const [resList, avList] = await Promise.all([
        api.getReservas({ id_negocio: negocioId }),
        api.getAvaliacoes({ id_negocio: negocioId }),
      ]);
      setReservas(resList);
      setAvaliacoes(avList);
    } catch (err) {
      console.error('Erro ao carregar dados do negócio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (reservaId: string, status: Reserva['status']) => {
    try {
      await api.updateReservaStatus(reservaId, status);
      setActionMessage(`Status da reserva atualizado para "${status.toUpperCase()}" com sucesso!`);
      setTimeout(() => setActionMessage(null), 3500);
      if (selectedNegocio) {
        loadBusinessData(selectedNegocio.id);
      }
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNegocio) return;

    setLoading(true);
    try {
      const destaques = destaquesStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.updateNegocio(selectedNegocio.id, {
        nome,
        descricao,
        descricaoCompleta,
        horarios,
        contato,
        emailContato,
        preco_medio: precoMedio,
        capacidade: Number(capacidade),
        destaques,
      });

      setActionMessage('Informações da propriedade e ofertas atualizadas com sucesso em tempo real!');
      setTimeout(() => setActionMessage(null), 3500);
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar alterações');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyReview = async (avaliacaoId: string) => {
    const texto = replyTextMap[avaliacaoId];
    if (!texto || !texto.trim()) return;

    try {
      await api.responderAvaliacao(avaliacaoId, texto);
      setActionMessage('Resposta enviada ao visitante com sucesso!');
      setTimeout(() => setActionMessage(null), 3500);
      if (selectedNegocio) {
        loadBusinessData(selectedNegocio.id);
      }
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar resposta');
    }
  };

  const handleCreateOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNegocio) return;

    try {
      await api.createAtrativoEvento({
        titulo: novoTitulo,
        tipo: novoTipo,
        categoria: novaCategoria,
        categoriaLabel: novaCategoria.toUpperCase(),
        descricao: novaDescricao,
        local: selectedNegocio.nome + ' - ' + selectedNegocio.bairroDistrito,
        lat: selectedNegocio.lat,
        lng: selectedNegocio.lng,
        data_inicio: novaDataInicio || undefined,
        data_fim: novaDataFim || undefined,
        preco: novoPreco,
        foto: selectedNegocio.fotos[0] || '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg',
        id_negocio_relacionado: selectedNegocio.id,
      });

      setActionMessage(`Nova atividade "${novoTitulo}" publicada com sucesso no catálogo de Canoinhas!`);
      setTimeout(() => setActionMessage(null), 3500);
      setNovoTitulo('');
      setNovaDescricao('');
      setActiveTab('reservas');
      onDataUpdated();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar evento/atrativo');
    }
  };

  if (!selectedNegocio) {
    return <div className="p-8 text-center text-slate-500">Nenhum estabelecimento encontrado.</div>;
  }

  const pendentesCount = reservas.filter((r) => r.status === 'pendente').length;
  const confirmadasCount = reservas.filter((r) => r.status === 'confirmada').length;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden">
      {/* Top Bar for Admin */}
      <div className="bg-[#1B4332] text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-[#A3E635] font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Painel do Empreendedor Rural · Rota dos Ervais</span>
            </div>
            <h2 className="text-2xl font-bold font-display mt-1">
              Gestão da Propriedade em Tempo Real
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              Administre disponibilidades, confirme reservas de visitantes e atualize seus atrativos locais.
            </p>
          </div>

          {/* Property Selector */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/20">
            <Building2 className="w-4 h-4 text-[#A3E635] shrink-0" />
            <div className="text-xs">
              <div className="text-white/60 text-[10px] uppercase font-bold">Gerenciando Propriedade</div>
              <select
                value={selectedNegocioId}
                onChange={(e) => setSelectedNegocioId(e.target.value)}
                className="bg-transparent text-white font-semibold text-xs focus:outline-hidden cursor-pointer"
              >
                {negocios.map((n) => (
                  <option key={n.id} value={n.id} className="text-slate-900">
                    {n.nome} ({n.nome_dono})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action feedback alert */}
        {actionMessage && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-white flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-[#A3E635]" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <div className="text-[11px] text-white/70">Reservas Totais</div>
            <div className="text-xl font-bold font-mono mt-0.5">{reservas.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <div className="text-[11px] text-white/70">Aguardando Resposta</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-0.5 flex items-center gap-1">
              <span>{pendentesCount}</span>
              {pendentesCount > 0 && <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded-full font-sans font-bold">Ação</span>}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <div className="text-[11px] text-white/70">Confirmadas</div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">{confirmadasCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <div className="text-[11px] text-white/70">Avaliação Média</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-0.5 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>{selectedNegocio.nota.toFixed(1)}</span>
              <span className="text-xs text-white/60 font-sans">({selectedNegocio.num_avaliacoes})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E1D8] bg-[#FAF9F5] px-6 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('reservas')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'reservas'
              ? 'border-[#2D6A4F] text-[#1B4332]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Solicitações de Reserva ({reservas.length})</span>
          {pendentesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('perfil')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'perfil'
              ? 'border-[#2D6A4F] text-[#1B4332]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Editar Propriedade & Ofertas (RF05)</span>
        </button>

        <button
          onClick={() => setActiveTab('avaliacoes')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'avaliacoes'
              ? 'border-[#2D6A4F] text-[#1B4332]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Avaliações & Respostas ({avaliacoes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('novo_evento')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'novo_evento'
              ? 'border-[#2D6A4F] text-[#1B4332]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Nova Atividade / Evento</span>
        </button>
      </div>

      {/* Tab 1: RESERVAS */}
      {activeTab === 'reservas' && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#1B4332] font-display">
                Controle de Reservas de Visitantes (RF03)
              </h3>
              <p className="text-xs text-slate-500">
                Responda prontamente para manter uma alta taxa de aprovação e fidelizar turistas.
              </p>
            </div>
            <button
              onClick={() => loadBusinessData(selectedNegocio.id)}
              className="text-xs font-semibold text-[#2D6A4F] hover:underline"
            >
              Atualizar Lista
            </button>
          </div>

          {reservas.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF9F5] rounded-xl border border-[#E5E1D8] text-xs text-slate-500">
              Nenhuma solicitação de reserva recebida até o momento para este estabelecimento.
            </div>
          ) : (
            <div className="space-y-3">
              {reservas.map((res) => {
                const isPendente = res.status === 'pendente';
                const isConfirmada = res.status === 'confirmada';
                const isRecusada = res.status === 'recusada';

                return (
                  <div
                    key={res.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isPendente
                        ? 'bg-amber-50/50 border-amber-300'
                        : isConfirmada
                        ? 'bg-[#FAF9F5] border-emerald-200'
                        : 'bg-slate-50 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {res.nome_usuario}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            #{res.id.slice(-6)}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isPendente
                                ? 'bg-amber-200 text-amber-900'
                                : isConfirmada
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5">
                          <span className="flex items-center gap-1 font-semibold text-[#1B4332]">
                            <Clock className="w-3.5 h-3.5" />
                            {res.data} às {res.hora}
                          </span>
                          <span>·</span>
                          <span>{res.numero_pessoas} pessoas</span>
                          <span>·</span>
                          <span className="capitalize">{res.tipo_reserva.replace('_', ' ')}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3" />
                            {res.telefone_usuario}
                          </span>
                        </div>

                        {res.observacoes && (
                          <div className="text-xs text-slate-600 mt-2 bg-white/80 p-2.5 rounded-lg border border-[#E5E1D8]">
                            <strong>Observações do visitante:</strong> {res.observacoes}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isPendente && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'confirmada')}
                              className="px-3 py-1.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Confirmar</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(res.id, 'recusada')}
                              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Recusar</span>
                            </button>
                          </>
                        )}

                        {isConfirmada && (
                          <button
                            onClick={() => handleUpdateStatus(res.id, 'concluida')}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                          >
                            Concluir Atendimento
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: EDITAR PERFIL & OFERTAS */}
      {activeTab === 'perfil' && (
        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#1B4332] font-display">
              Editar Cadastro do Estabelecimento Rural (RF05)
            </h3>
            <p className="text-xs text-slate-500">
              Mantenha fotos, horários de atendimento, preços e canais de contato sempre atualizados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome da Propriedade / Estabelecimento
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preço Médio / Faixa de Valor
              </label>
              <input
                type="text"
                value={precoMedio}
                onChange={(e) => setPrecoMedio(e.target.value)}
                required
                placeholder="Ex: R$ 68 / pessoa (Buffet Livre)"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chamada Curta (Exibida nos cards de busca)
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição Completa da Experiência e História
            </label>
            <textarea
              rows={4}
              value={descricaoCompleta}
              onChange={(e) => setDescricaoCompleta(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Telefone Direto
              </label>
              <input
                type="text"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail de Contato
              </label>
              <input
                type="email"
                value={emailContato}
                onChange={(e) => setEmailContato(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Capacidade Simultânea (Pessoas)
              </label>
              <input
                type="number"
                value={capacidade}
                onChange={(e) => setCapacidade(parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Horários de Funcionamento e Atendimento
            </label>
            <input
              type="text"
              value={horarios}
              onChange={(e) => setHorarios(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Destaques e Atrativos do Local (separados por vírgula)
            </label>
            <input
              type="text"
              value={destaquesStr}
              onChange={(e) => setDestaquesStr(e.target.value)}
              placeholder="Ex: Café colonial no fogão a lenha, Trilha das Araucárias, Chimarrão de boas-vindas"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#2D6A4F] text-white text-xs font-bold rounded-xl hover:bg-[#1B4332] shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Salvando...' : 'Salvar Alterações em Tempo Real'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: AVALIACOES */}
      {activeTab === 'avaliacoes' && (
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#1B4332] font-display">
              Avaliações dos Turistas e Respostas do Anfitrião
            </h3>
            <p className="text-xs text-slate-500">
              Interaja com seus hóspedes respondendo elogios e sugestões de melhoria.
            </p>
          </div>

          {avaliacoes.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF9F5] rounded-xl border border-[#E5E1D8] text-xs text-slate-500">
              Nenhuma avaliação cadastrada ainda para este negócio.
            </div>
          ) : (
            <div className="space-y-4">
              {avaliacoes.map((av) => (
                <div key={av.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{av.nome_usuario}</span>
                      <span className="text-[11px] text-slate-500 ml-2">em {av.data}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(av.nota)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-slate-800 ml-1">{av.nota}.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700">{av.comentario}</p>

                  {av.resposta_dono ? (
                    <div className="p-3 bg-white border border-[#D5CFBF] rounded-lg text-xs space-y-1">
                      <div className="font-semibold text-[#1B4332]">Sua Resposta:</div>
                      <div className="text-slate-600 italic">"{av.resposta_dono}"</div>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-200">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Responder a {av.nome_usuario}:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Agradeça a visita ou esclareça uma dúvida..."
                          value={replyTextMap[av.id] || ''}
                          onChange={(e) =>
                            setReplyTextMap({ ...replyTextMap, [av.id]: e.target.value })
                          }
                          className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:border-[#2D6A4F]"
                        />
                        <button
                          onClick={() => handleReplyReview(av.id)}
                          className="px-4 py-1.5 bg-[#2D6A4F] text-white text-xs font-semibold rounded-lg hover:bg-[#1B4332] whitespace-nowrap"
                        >
                          Enviar Resposta
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: CADASTRAR NOVO EVENTO / ATIVIDADE */}
      {activeTab === 'novo_evento' && (
        <form onSubmit={handleCreateOffering} className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#1B4332] font-display">
              Publicar Nova Atividade, Roteiro ou Evento em Canoinhas (RF01)
            </h3>
            <p className="text-xs text-slate-500">
              Divulgue festividades sazonais, festivais gastronômicos, feiras de produtores ou novas trilhas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Título do Evento ou Atrativo
              </label>
              <input
                type="text"
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                placeholder="Ex: Noite de Lareira e Degustação de Vinhos Coloniais"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo
              </label>
              <select
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value="evento">Evento / Festividade Temporária</option>
                <option value="atrativo">Atrativo Permanente / Trilha</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoria
              </label>
              <select
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
              >
                <option value="gastronomia">Gastronomia Típica</option>
                <option value="rural">Turismo Rural & Vivência</option>
                <option value="natureza">Natureza & Trilhas</option>
                <option value="cultural">Cultura & História</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                value={novaDataInicio}
                onChange={(e) => setNovaDataInicio(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valor Sugerido / Ingresso
              </label>
              <input
                type="text"
                value={novoPreco}
                onChange={(e) => setNovoPreco(e.target.value)}
                placeholder="Ex: Gratuito ou R$ 35"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição Detalhada do que o Visitante Encontrará
            </label>
            <textarea
              rows={3}
              value={novaDescricao}
              onChange={(e) => setNovaDescricao(e.target.value)}
              placeholder="Descreva a programação, atrações, roupas recomendadas e se necessita reserva antecipada..."
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#2D6A4F] text-white text-xs font-bold rounded-xl hover:bg-[#1B4332] shadow-xs flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Imediatamente na Rota dos Ervais</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
