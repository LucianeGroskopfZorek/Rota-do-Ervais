import React, { useState } from 'react';
import { Roteiro, Negocio } from '../types/index.ts';
import { Clock, MapPin, Compass, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';

interface RoteirosViewProps {
  roteiros: Roteiro[];
  negocios: Negocio[];
  onSelectNegocio: (id: string) => void;
  onOpenBooking: (negocio: Negocio) => void;
}

export const RoteirosView: React.FC<RoteirosViewProps> = ({
  roteiros,
  negocios,
  onSelectNegocio,
  onOpenBooking,
}) => {
  const [selectedRoteiroId, setSelectedRoteiroId] = useState<string>(
    roteiros[0]?.id || ''
  );

  const selectedRoteiro =
    roteiros.find((r) => r.id === selectedRoteiroId) || roteiros[0];

  if (!selectedRoteiro) return null;

  return (
    <div className="space-y-8">
      {/* Roteiro Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roteiros.map((rot) => {
          const isSelected = rot.id === selectedRoteiro.id;
          return (
            <button
              key={rot.id}
              onClick={() => setSelectedRoteiroId(rot.id)}
              className={`p-5 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-md'
                  : 'bg-white text-slate-900 border-[#E5E1D8] hover:border-[#2D6A4F]/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span
                    className={`font-semibold uppercase tracking-wider text-[11px] ${
                      isSelected ? 'text-[#A3E635]' : 'text-[#854D0E]'
                    }`}
                  >
                    {rot.dificuldade}
                  </span>
                  <span
                    className={`flex items-center gap-1 font-mono ${
                      isSelected ? 'text-white/80' : 'text-slate-500'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {rot.duracao}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display mb-1.5 leading-snug">
                  {rot.titulo}
                </h3>
                <p
                  className={`text-xs line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-white/80' : 'text-slate-600'
                  }`}
                >
                  {rot.subtitulo}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-semibold">
                <span className={isSelected ? 'text-white/90' : 'text-[#2D6A4F]'}>
                  {rot.paradas.length} Paradas planejadas
                </span>
                <span className="flex items-center gap-1">
                  <span>Explorar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Roteiro Detail Timeline */}
      <div className="bg-white rounded-2xl border border-[#E5E1D8] shadow-sm overflow-hidden">
        {/* Banner with picture */}
        <div className="relative h-60 sm:h-72 w-full bg-[#1B4332]">
          <img
            src={selectedRoteiro.foto}
            alt={selectedRoteiro.titulo}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-3 text-xs mb-2">
              <span className="bg-[#A3E635] text-[#1B4332] font-bold px-2.5 py-0.5 rounded-full uppercase">
                {selectedRoteiro.duracao}
              </span>
              <span>·</span>
              <span className="text-white/90 font-medium">Nível: {selectedRoteiro.dificuldade}</span>
              <span>·</span>
              <span className="text-white/90 font-medium">Foco: {selectedRoteiro.foco}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display">
              {selectedRoteiro.titulo}
            </h2>
            <p className="text-xs sm:text-sm text-white/90 max-w-2xl mt-1.5 line-clamp-2">
              {selectedRoteiro.descricao}
            </p>
          </div>
        </div>

        {/* Timeline Stops */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1B4332] font-display">
                Itinerário Passo a Passo
              </h3>
              <p className="text-xs text-slate-500">
                Ordem recomendada de paradas para otimizar tempo e deslocamento na região de Canoinhas.
              </p>
            </div>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#2D6A4F]/30 space-y-6">
            {selectedRoteiro.paradas.map((parada) => {
              const linkedNegocio = parada.id_referencia
                ? negocios.find((n) => n.id === parada.id_referencia)
                : null;

              return (
                <div key={parada.ordem} className="relative group">
                  {/* Step circle indicator */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white">
                    {parada.ordem}
                  </div>

                  <div className="p-4 sm:p-5 rounded-xl bg-[#FAF9F5] border border-[#E5E1D8] hover:border-[#2D6A4F]/50 transition-all space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-semibold text-[#854D0E] uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{parada.horario_sugerido}</span>
                          <span>·</span>
                          <span className="capitalize">{parada.tipo}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 font-display mt-0.5">
                          {parada.titulo}
                        </h4>
                      </div>

                      {linkedNegocio && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => onSelectNegocio(linkedNegocio.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#2D6A4F] bg-white border border-[#2D6A4F] rounded-lg hover:bg-[#2D6A4F]/10 transition-colors"
                          >
                            Ver Local
                          </button>
                          <button
                            onClick={() => onOpenBooking(linkedNegocio)}
                            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2D6A4F] rounded-lg hover:bg-[#1B4332] transition-colors flex items-center gap-1"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Reservar</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {parada.descricao}
                    </p>

                    {linkedNegocio && (
                      <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 border-t border-[#EFECE6]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
                          {linkedNegocio.endereco}
                        </span>
                        <span>·</span>
                        <span>Preço médio: {linkedNegocio.preco_medio}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
