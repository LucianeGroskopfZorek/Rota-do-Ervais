import React from 'react';
import { Negocio, Avaliacao } from '../types/index.ts';
import { X, Star, MapPin, Clock, Phone, Mail, Check, MessageSquare, Calendar } from 'lucide-react';

interface DetailModalProps {
  negocio: Negocio | null;
  avaliacoes: Avaliacao[];
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: (negocio: Negocio) => void;
  onOpenReview: (negocio: Negocio) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  negocio,
  avaliacoes,
  isOpen,
  onClose,
  onOpenBooking,
  onOpenReview,
}) => {
  if (!isOpen || !negocio) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-[#E5E1D8] overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header with image banner */}
        <div className="relative h-56 sm:h-72 w-full bg-[#1B4332] shrink-0">
          <img
            src={negocio.fotos[0] || '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg'}
            alt={negocio.nome}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs uppercase tracking-wider text-[#A3E635] font-semibold">
              {negocio.categoriaLabel}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
              {negocio.nome}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 mt-1">
              <span className="flex items-center gap-1 font-semibold text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {negocio.nota.toFixed(1)} ({negocio.num_avaliacoes} avaliações)
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {negocio.bairroDistrito}
              </span>
              {negocio.distanciaKm !== undefined && (
                <>
                  <span>·</span>
                  <span className="text-[#A3E635] font-semibold">{negocio.distanciaKm} km de você</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Action strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#FAF9F5] border border-[#E5E1D8] rounded-xl">
            <div>
              <div className="text-xs text-slate-500 font-medium">Faixa de valor sugerida</div>
              <div className="text-base font-bold text-[#1B4332]">{negocio.preco_medio}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenReview(negocio)}
                className="px-4 py-2 text-xs font-semibold text-[#1B4332] bg-white border border-[#2D6A4F] hover:bg-[#2D6A4F]/10 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Avaliar Experiência
              </button>
              <button
                onClick={() => onOpenBooking(negocio)}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Solicitar Reserva
              </button>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-bold text-[#1B4332] uppercase tracking-wider mb-2 font-display">
              Sobre a Experiência
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {negocio.descricaoCompleta || negocio.descricao}
            </p>
          </div>

          {/* Destaques */}
          <div>
            <h4 className="text-sm font-bold text-[#1B4332] uppercase tracking-wider mb-3 font-display">
              Diferenciais & Vivências do Campo
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {negocio.destaques.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F5] text-slate-800">
                  <span className="w-4 h-4 rounded-full bg-[#2D6A4F]/20 text-[#2D6A4F] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Endereço</div>
                  <div>{negocio.endereco}</div>
                  <div className="text-slate-500">{negocio.bairroDistrito}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Horários de Atendimento</div>
                  <div>{negocio.horarios}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">Contato / WhatsApp Anfitrião</div>
                  <div className="font-mono">{negocio.contato}</div>
                  <div className="text-slate-500 font-medium">Anfitrião: {negocio.nome_dono}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-800">E-mail Direto</div>
                  <div>{negocio.emailContato}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-[#1B4332] uppercase tracking-wider font-display">
                  Avaliações Verificadas de Visitantes
                </h4>
                <div className="text-xs text-slate-500">
                  {avaliacoes.length} {avaliacoes.length === 1 ? 'avaliação' : 'avaliações'} de turistas reais
                </div>
              </div>
              <button
                onClick={() => onOpenReview(negocio)}
                className="text-xs font-semibold text-[#2D6A4F] hover:underline"
              >
                Escrever Avaliação
              </button>
            </div>

            {avaliacoes.length === 0 ? (
              <div className="p-4 bg-[#FAF9F5] rounded-xl text-center text-xs text-slate-500">
                Ainda não há avaliações cadastradas. Seja o primeiro a reservar e contar como foi sua visita!
              </div>
            ) : (
              <div className="space-y-3">
                {avaliacoes.map((av) => (
                  <div key={av.id} className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-xs">
                          {av.nome_usuario.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-slate-800">{av.nome_usuario}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(av.nota)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-500 ml-1">{av.data}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{av.comentario}</p>

                    {/* Owner reply */}
                    {av.resposta_dono && (
                      <div className="mt-2 ml-4 p-3 bg-white border border-[#D5CFBF] rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-[#1B4332] flex items-center gap-1">
                          <span>Resposta do Anfitrião ({negocio.nome_dono})</span>
                          <span className="text-[10px] text-slate-400">· {av.data_resposta || 'Recente'}</span>
                        </div>
                        <div className="text-slate-600 italic">"{av.resposta_dono}"</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#E5E1D8] flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Reserva direta sem intermediários abusivos · Apoie Canoinhas SC
          </div>
          <button
            onClick={() => onOpenBooking(negocio)}
            className="px-6 py-2.5 bg-[#2D6A4F] text-white text-xs font-bold rounded-xl hover:bg-[#1B4332] transition-colors"
          >
            Solicitar Reserva Agora
          </button>
        </div>
      </div>
    </div>
  );
};
