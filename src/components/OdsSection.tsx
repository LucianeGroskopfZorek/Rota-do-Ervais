import React from 'react';
import { StatsResponse } from '../types/index.ts';
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle,
  Users,
  Compass,
  FileText,
  Building,
  Target
} from 'lucide-react';

interface OdsSectionProps {
  stats: StatsResponse | null;
}

export const OdsSection: React.FC<OdsSectionProps> = ({ stats }) => {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#1B4332] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-[#A3E635] text-xs font-bold uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            <span>UC6: Prototipação Rápida de Aplicações com IA | 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
            ROTA DOS ERVAIS · Canoinhas SC
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mt-2 leading-relaxed">
            Desenvolvido por <strong>Luciane Grosskopf Zorek</strong> e <strong>Nicolas Duma</strong> no eixo de Turismo, Hospitalidade e Lazer. Uma solução com impacto social real para conectar pequenos empresários do campo, pousadas e restaurantes coloniais aos turistas de natureza.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#A3E635] font-mono">
            <span>ODS 8 (Meta 8.9)</span>
            <span>·</span>
            <span>ODS 11 (Meta 11.4)</span>
            <span>·</span>
            <span>ODS 12 (Meta 12.b)</span>
            <span>·</span>
            <span>ECA Digital & LGPD 2026</span>
          </div>
        </div>
      </div>

      {/* Real Indicators from Backend */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E5E1D8] shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Negócios Cadastrados
            </div>
            <div className="text-3xl font-bold font-mono text-[#1B4332] mt-1">
              {stats.totalNegocios}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Produtores e pousadas locais</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E1D8] shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Reservas Intermediadas
            </div>
            <div className="text-3xl font-bold font-mono text-[#2D6A4F] mt-1">
              {stats.totalReservas}
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              {stats.reservasConfirmadas} confirmadas sem taxa
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E1D8] shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Avaliações Verificadas
            </div>
            <div className="text-3xl font-bold font-mono text-amber-700 mt-1">
              {stats.totalAvaliacoes}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Nota média: ★ {stats.mediaGeralNotas} / 5.0</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5E1D8] shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Roteiros Estruturados
            </div>
            <div className="text-3xl font-bold font-mono text-[#8B5E3C] mt-1">
              {stats.totalRoteiros}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Circuitos ecológicos e gastronômicos</div>
          </div>
        </div>
      )}

      {/* ODS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ODS 8 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E1D8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#BC6C25]/10 text-[#BC6C25] flex items-center justify-center font-black text-xl">
            8
          </div>
          <h3 className="text-base font-bold text-[#1B4332] font-display">
            ODS 8 · Trabalho Decente e Crescimento Econômico
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Meta 8.9:</strong> Promover o turismo sustentável que gera empregos, valoriza a cultura local e os produtos artesanais do campo.
          </p>
          <div className="text-xs text-slate-700 pt-2 border-t border-slate-100">
            <strong>Como a Rota dos Ervais atua:</strong> Dá visibilidade direta a pequenos proprietários rurais e cantinas familiares de Canoinhas sem cobrar comissões predatórias de grandes OTAs, retendo 100% da renda no município.
          </div>
        </div>

        {/* ODS 11 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E1D8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center font-black text-xl">
            11
          </div>
          <h3 className="text-base font-bold text-[#1B4332] font-display">
            ODS 11 · Cidades e Comunidades Sustentáveis
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Meta 11.4:</strong> Fortalecer esforços para proteger e salvaguardar o patrimônio cultural e natural.
          </p>
          <div className="text-xs text-slate-700 pt-2 border-t border-slate-100">
            <strong>Como a Rota dos Ervais atua:</strong> Valoriza o patrimônio histórico ferroviário de Marcílio Dias, a memória do Contestado e a preservação das florestas nativas de Araucárias e cachoeiras de Canoinhas.
          </div>
        </div>

        {/* ODS 12 */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E1D8] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-[#52B788]/10 text-[#1B4332] flex items-center justify-center font-black text-xl">
            12
          </div>
          <h3 className="text-base font-bold text-[#1B4332] font-display">
            ODS 12 · Consumo e Produção Responsáveis
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Meta 12.b:</strong> Desenvolver e implementar instrumentos para monitorar os impactos do turismo sustentável.
          </p>
          <div className="text-xs text-slate-700 pt-2 border-t border-slate-100">
            <strong>Como a Rota dos Ervais atua:</strong> Fomenta a alimentação agroecológica com produtos sazonais (erva-mate sombreada, pinhão, frutas da época, queijo artesanal) e incentiva o descarte zero nas trilhas ecológicas.
          </div>
        </div>
      </div>

      {/* Compliance & Methodology Highlights */}
      <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E5E1D8] space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1B4332] font-display">
          <ShieldCheck className="w-5 h-5 text-[#2D6A4F]" />
          <span>Diretrizes Éticas e Conformidade Legal (Seções 14 e 15 do Documento Técnico)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-3 bg-white rounded-xl border border-[#E5E1D8] space-y-1">
            <div className="font-bold text-[#1B4332]">ECA Digital (Vigente 2026)</div>
            <p className="text-slate-600">
              Proteção infantil por padrão: sem anúncios comerciais, sem rastreamento comportamental e sem perfilamento. Reservas e avaliações exigem termo de maioridade.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E5E1D8] space-y-1">
            <div className="font-bold text-[#1B4332]">LGPD e Minimização de Dados</div>
            <p className="text-slate-600">
              Coleta estrita dos dados necessários (nome, e-mail e contato telefônico) com uso exclusivo para comunicação anfitrião-viajante.
            </p>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#E5E1D8] space-y-1">
            <div className="font-bold text-[#1B4332]">Regras de Negócio RN01 a RN03</div>
            <p className="text-slate-600">
              Avaliações blindadas contra spam (RN02: no máximo 1 avaliação vinculada por reserva concluída) e autonomia do produtor na gestão do seu próprio perfil (RN03).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
