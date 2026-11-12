import React, { useState } from 'react';
import { Negocio, Reserva } from '../types/index.ts';
import { api } from '../services/api.ts';
import { X, Calendar, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  negocio: Negocio;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reserva: Reserva) => void;
  currentUser?: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
  };
}

export const BookingModal: React.FC<BookingModalProps> = ({
  negocio,
  isOpen,
  onClose,
  onSuccess,
  currentUser = {
    id: 'user_carla',
    nome: 'Carla Silveira Mendes',
    email: 'carla.mendes@email.com',
    telefone: '(41) 99823-4410',
  },
}) => {
  if (!isOpen) return null;

  const [data, setData] = useState(() => {
    // default to next Saturday
    const d = new Date();
    d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
    return d.toISOString().split('T')[0];
  });
  const [hora, setHora] = useState(negocio.categoria === 'pousada' ? '14:00' : '12:30');
  const [numPessoas, setNumPessoas] = useState(2);
  const [tipoReserva, setTipoReserva] = useState<Reserva['tipo_reserva']>(
    negocio.categoria === 'pousada'
      ? 'hospedagem'
      : negocio.categoria === 'restaurante'
      ? 'almoco_colonial'
      : 'experiencia_rural'
  );
  const [nome, setNome] = useState(currentUser.nome);
  const [email, setEmail] = useState(currentUser.email);
  const [telefone, setTelefone] = useState(currentUser.telefone || '(47) 99999-0000');
  const [observacoes, setObservacoes] = useState('');
  const [declaracaoIdade, setDeclaracaoIdade] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedReserva, setSubmittedReserva] = useState<Reserva | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaracaoIdade) {
      setError('É necessário declarar ter mais de 18 anos ou autorização do responsável.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nova = await api.createReserva({
        id_usuario: currentUser.id,
        nome_usuario: nome,
        email_usuario: email,
        telefone_usuario: telefone,
        id_negocio: negocio.id,
        nome_negocio: negocio.nome,
        categoria_negocio: negocio.categoria,
        data,
        hora,
        numero_pessoas: numPessoas,
        tipo_reserva: tipoReserva,
        observacoes,
      });

      setSubmittedReserva(nova);
      onSuccess(nova);
    } catch (err: any) {
      setError(err.message || 'Não foi possível enviar sua solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E5E1D8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1B4332] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#A3E635] font-semibold">
              {negocio.categoriaLabel}
            </span>
            <h3 className="text-xl font-bold font-display">{negocio.nome}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedReserva ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-[#1B4332] mb-2 font-display">
              Solicitação Enviada com Sucesso!
            </h4>
            <p className="text-sm text-slate-600 mb-6">
              Sua solicitação de reserva (<strong>#{submittedReserva.id.slice(-6)}</strong>) foi encaminhada diretamente para o anfitrião rural <strong>{negocio.nome_dono}</strong>. Você receberá a confirmação em breve no e-mail informado.
            </p>

            <div className="bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl p-4 text-left text-xs text-slate-700 space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-500">Data e Horário:</span>
                <span className="font-semibold">{submittedReserva.data} às {submittedReserva.hora}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pessoas:</span>
                <span className="font-semibold">{submittedReserva.numero_pessoas} pessoas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tipo:</span>
                <span className="font-semibold capitalize">{submittedReserva.tipo_reserva.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status atual:</span>
                <span className="font-semibold text-amber-700 uppercase">Pendente de aprovação</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-[#2D6A4F] text-white font-medium rounded-xl hover:bg-[#1B4332] transition-colors"
            >
              Concluir & Voltar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tipo de Experiência
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {negocio.categoria === 'pousada' && (
                  <button
                    type="button"
                    onClick={() => setTipoReserva('hospedagem')}
                    className={`p-2.5 rounded-lg border font-medium text-left transition-colors ${
                      tipoReserva === 'hospedagem'
                        ? 'border-[#2D6A4F] bg-[#2D6A4F]/10 text-[#1B4332]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Hospedagem & Chalé
                  </button>
                )}
                {negocio.categoria === 'restaurante' && (
                  <button
                    type="button"
                    onClick={() => setTipoReserva('almoco_colonial')}
                    className={`p-2.5 rounded-lg border font-medium text-left transition-colors ${
                      tipoReserva === 'almoco_colonial'
                        ? 'border-[#2D6A4F] bg-[#2D6A4F]/10 text-[#1B4332]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Almoço ou Café Colonial
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setTipoReserva('experiencia_rural')}
                  className={`p-2.5 rounded-lg border font-medium text-left transition-colors ${
                    tipoReserva === 'experiencia_rural'
                      ? 'border-[#2D6A4F] bg-[#2D6A4F]/10 text-[#1B4332]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Day Use / Visita Guiada
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Data Prevista</span>
                </label>
                <input
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Horário Sugerido</span>
                </label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Número de Pessoas</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={numPessoas}
                  onChange={(e) => setNumPessoas(parseInt(e.target.value))}
                  className="w-full accent-[#2D6A4F]"
                />
                <span className="w-12 text-center text-sm font-bold bg-[#FAF9F5] border border-slate-200 rounded-lg py-1 text-[#1B4332]">
                  {numPessoas} {numPessoas === 1 ? 'pessoa' : 'pessoas'}
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail para Confirmação
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observações ou Pedidos Especiais (opcional)
                </label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: viajamos com crianças pequenas, restrições alimentares ou interesse em passeio a cavalo..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:border-[#2D6A4F]"
                />
              </div>

              {/* Compliance checklist notice (Section 15) */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declaracaoIdade}
                    onChange={(e) => setDeclaracaoIdade(e.target.checked)}
                    className="mt-0.5 accent-[#2D6A4F]"
                  />
                  <span>
                    Declaro ser maior de 18 anos ou possuir autorização do responsável legal para solicitar a reserva (Conformidade ECA Digital & LGPD - uso restrito ao contato da reserva).
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Confirmar Solicitação'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
