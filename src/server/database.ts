import fs from 'fs';
import path from 'path';
import {
  Negocio,
  AtrativoEvento,
  Roteiro,
  Reserva,
  Avaliacao,
  Usuario,
  StatsResponse,
  CANOINHAS_CENTER
} from '../types/index.ts';

export { CANOINHAS_CENTER };

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'conecta_database.json');

// Initial Seed Data highlighting authentic Canoinhas locations, producers, and traditions
const INITIAL_USUARIOS: Usuario[] = [
  {
    id: 'user_carla',
    nome: 'Carla Silveira Mendes',
    email: 'carla.mendes@email.com',
    tipo: 'visitante',
    telefone: '(41) 99823-4410',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_nicolas',
    nome: 'Nicolas Duma',
    email: 'contato@valedasaraucarias.com.br',
    tipo: 'negocio',
    telefone: '(47) 99122-3841',
    propriedadeNome: 'Pousada Rural Vale das Araucárias',
  },
  {
    id: 'user_luciane',
    nome: 'Luciane Grosskopf Zorek',
    email: 'cantina@donafrida.com.br',
    tipo: 'negocio',
    telefone: '(47) 99245-7790',
    propriedadeNome: 'Cantina Colonial Dona Frida',
  },
  {
    id: 'user_pedro',
    nome: 'Pedro Zorek',
    email: 'fazenda@serranegra.com.br',
    tipo: 'negocio',
    telefone: '(47) 98841-2900',
    propriedadeNome: 'Fazenda Histórica Agroecológica Serra Negra',
  },
];

const INITIAL_NEGOCIOS: Negocio[] = [
  {
    id: 'neg_valedasaraucarias',
    nome: 'Pousada Rural Vale das Araucárias',
    categoria: 'pousada',
    categoriaLabel: 'Hospedagem & Pousada Rural',
    descricao: 'Chalés privativos de madeira rústica imersos em um bosque preservado de araucárias centenárias.',
    descricaoCompleta: 'A Pousada Rural Vale das Araucárias é um refúgio de tranquilidade no interior de Canoinhas. Oferecemos chalés privativos confortáveis com lareira, lençol térmico, varanda com vista para os morros e jardim de hortênsias. Pela manhã, os hóspedes desfrutam de um farto café colonial preparado em fogão a lenha, com queijos artesanais da região, pães caseiros quentinhos, geleias de amora colhidas na fazenda e o tradicional chimarrão de boas-vindas. Possui trilhas ecológicas autoguiadas, lago para contemplação e redário.',
    endereco: 'Estrada Geral de Taunay, Km 8',
    bairroDistrito: 'Distrito de Taunay, Canoinhas - SC',
    contato: '(47) 99122-3841',
    emailContato: 'contato@valedasaraucarias.com.br',
    horarios: 'Check-in: 14h | Check-out: 12h (Aberto todos os dias com reserva prévia)',
    id_dono: 'user_nicolas',
    nome_dono: 'Nicolas Duma & Família',
    lat: -26.2312,
    lng: -50.4420,
    preco_medio: 'R$ 340 / diária casal (com café colonial incluso)',
    capacidade: 28,
    fotos: [
      '/src/assets/images/pousada_fazenda_1794441254481.jpg',
      '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg'
    ],
    destaques: [
      'Chalés com lareira e varanda privativa',
      'Café colonial típico no fogão a lenha',
      'Trilha do Bosque das Araucárias',
      'Chimarrão com erva-mate nativa de boas-vindas',
      'Pet friendly sob consulta',
      'Wi-Fi nas áreas comuns e estacionamento seguro'
    ],
    nota: 4.9,
    num_avaliacoes: 19,
  },
  {
    id: 'neg_donafrida',
    nome: 'Cantina & Café Colonial Dona Frida',
    categoria: 'restaurante',
    categoriaLabel: 'Gastronomia Típica & Café Colonial',
    descricao: 'Culinária tradicional cabocla e alemã: quirera lapeana com costelinha, cuca artesanal e broa de milho.',
    descricaoCompleta: 'Localizada no histórico Vale de Valinhos, a Cantina Dona Frida preserva as receitas centenárias passadas por quatro gerações de famílias colonizadoras do Planalto Norte Catarinense. Servimos aos sábados e domingos o autêntico buffet tropeiro com quirera lapeana cremosa, costelinha suína defumada em lenha de pessegueiro, pierogi artesanal e polenta na chapa. À tarde, nosso banquete de café colonial inclui mais de 20 variedades de cucas doces e salgadas, torta alemã, chimias caseiras e café passado na hora.',
    endereco: 'Rota das Colônias, Linha Valinhos, Estrada Geral',
    bairroDistrito: 'Linha Valinhos, Canoinhas - SC',
    contato: '(47) 99245-7790',
    emailContato: 'cantina@donafrida.com.br',
    horarios: 'Sábados e Domingos: 11h30 às 18h30 (Sextas sob agendamento de grupos)',
    id_dono: 'user_luciane',
    nome_dono: 'Luciane Grosskopf Zorek',
    lat: -26.1550,
    lng: -50.3380,
    preco_medio: 'R$ 68 / pessoa (Buffet livre com sobremesas)',
    capacidade: 70,
    fotos: [
      '/src/assets/images/gastronomia_colonial_1794441253419.jpg',
      '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg'
    ],
    destaques: [
      'Quirera colonial com costelinha defumada',
      'Cucas assadas em forno a lenha de tijolo',
      'Broa de milho na folha de bananeira',
      'Queijos coloniais curados no próprio sítio',
      'Espaço ao ar livre para crianças',
      'Venda de produtos coloniais para levar para casa'
    ],
    nota: 4.8,
    num_avaliacoes: 26,
  },
  {
    id: 'neg_serranegra',
    nome: 'Fazenda Histórica & Agroecológica Serra Negra',
    categoria: 'propriedade_rural',
    categoriaLabel: 'Turismo Rural & Vivência Agroecológica',
    descricao: 'Vivência rural completa: ordenha matinal, passeio de carruagem, colheita no pomar e piquenique nas araucárias.',
    descricaoCompleta: 'A Fazenda Serra Negra é uma propriedade centenária dedicada à agroecologia e ao turismo pedagógico e familiar. Os visitantes participam da rotina autêntica do campo: colheita de morangos e frutas da época sem agrotóxicos, alimentação de ovelhas e bezerros, passeio de charrete pelos campos de pastagem e visita guiada ao antigo engenho de erva-mate da família Zorek. Ao final do dia, servimos chimarrão com pinhão assado na brasa.',
    endereco: 'Estrada Velha Marcílio Dias, s/n',
    bairroDistrito: 'Distrito de Marcílio Dias, Canoinhas - SC',
    contato: '(47) 98841-2900',
    emailContato: 'fazenda@serranegra.com.br',
    horarios: 'Quarta a Domingo: 09h às 17h30 (Necessário agendar Day Use)',
    id_dono: 'user_pedro',
    nome_dono: 'Pedro Zorek',
    lat: -26.2120,
    lng: -50.3410,
    preco_medio: 'R$ 45 / pessoa (Day Use com degustação e visita guiada)',
    capacidade: 50,
    fotos: [
      '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg',
      '/src/assets/images/gastronomia_colonial_1794441253419.jpg'
    ],
    destaques: [
      'Visita ao histórico engenho de erva-mate',
      'Colheita de frutas e hortaliças no sistema agroecológico',
      'Passeio de charrete e contato com animais dóceis',
      'Degustação de pinhão na brasa e chimarrão artesanal',
      'Área sombreada para piqueniques sob araucárias',
      'Acessível para idosos e crianças pequenas'
    ],
    nota: 4.9,
    num_avaliacoes: 32,
  },
  {
    id: 'neg_saltoecoparque',
    nome: 'Eco-Parque das Cachoeiras do Rio Canoinhas',
    categoria: 'propriedade_rural',
    categoriaLabel: 'Trilhas Ecológicas & Ecoturismo',
    descricao: 'Três quedas d’água cristalinas, passarelas suspensas de madeira, rapel monitorado e banho de rio.',
    descricaoCompleta: 'Um dos santuários ecológicos mais belos do Planalto Norte Catarinense. O Eco-Parque oferece 4,5 km de trilhas limpas com passarelas rústicas de madeira que serpenteiam a mata atlântica de altitude e a floresta de araucárias. Conduz a três cachoeiras com poços naturais para banho, mirantes para fotos panorâmicas do cânion do Rio Canoinhas e área com quiosques rústicos e churrasqueiras para famílias passarem o dia.',
    endereco: 'Acesso Salto do Canoinhas, Km 14',
    bairroDistrito: 'Zona Rural Norte, Canoinhas - SC',
    contato: '(47) 99763-1204',
    emailContato: 'contato@saltocanoinhas.eco.br',
    horarios: 'Terça a Domingo: 08h30 às 18h00',
    id_dono: 'user_nicolas',
    nome_dono: 'Marcos Vinícius dos Santos',
    lat: -26.1210,
    lng: -50.4690,
    preco_medio: 'R$ 30 / entrada adulto (crianças até 10 anos não pagam)',
    capacidade: 120,
    fotos: [
      '/src/assets/images/trilha_cachoeira_1794441254975.jpg',
      '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg'
    ],
    destaques: [
      'Trilha das 3 Cachoeiras com passarelas de madeira',
      'Poços naturais com água cristalina para banho de rio',
      'Condutores ambientais locais capacitados',
      'Quiosques com mesas rústicas e água potável',
      'Estacionamento e vestiários limpos com duchas',
      'Coleta seletiva e compromisso ODS 12 de impacto zero'
    ],
    nota: 4.8,
    num_avaliacoes: 18,
  },
  {
    id: 'neg_recantodopinheiro',
    nome: 'Hospedaria & Estância Recanto do Pinheiro',
    categoria: 'pousada',
    categoriaLabel: 'Hospedagem & Pousada Rural',
    descricao: 'Cabanas acolhedoras no campo com fogão a lenha, cavalgadas ao pôr do sol e lago para pesca esportiva.',
    descricaoCompleta: 'Localizada na localidade rural de Rio dos Pardos, a Hospedaria Recanto do Pinheiro combina o charme da vida rural com acomodações aconchegantes. Perfeita para fins de semana em casal ou retiros em família. As noites contam com fogueira sob céu estrelado e roda de chimarrão com histórias do Contestado contadas pelos anfitriões.',
    endereco: 'Estrada Geral dos Pinheiros, s/n',
    bairroDistrito: 'Rio dos Pardos, Canoinhas - SC',
    contato: '(47) 99188-4422',
    emailContato: 'recanto@estanciadopinheiro.com.br',
    horarios: 'Check-in: 14h | Check-out: 11h30 (Atendimento todos os dias)',
    id_dono: 'user_pedro',
    nome_dono: 'Helena Grosskopf',
    lat: -26.2480,
    lng: -50.4150,
    preco_medio: 'R$ 290 / diária casal com café',
    capacidade: 22,
    fotos: [
      '/src/assets/images/pousada_fazenda_1794441254481.jpg',
      '/src/assets/images/trilha_cachoeira_1794441254975.jpg'
    ],
    destaques: [
      'Passeios a cavalo monitorados nos campos',
      'Lago para pesca esportiva (pesque e solte)',
      'Café da manhã com broa de milho e mel silvestre',
      'Fogueira externa nas noites frias de serra',
      'Silêncio e desconexão em meio à natureza'
    ],
    nota: 4.7,
    num_avaliacoes: 14,
  },
  {
    id: 'neg_estacaomarcilio',
    nome: 'Bistrô & Armazém Cultural Estação Marcílio Dias',
    categoria: 'restaurante',
    categoriaLabel: 'Gastronomia Histórica & Armazém',
    descricao: 'Café colonial e tortas artesanais no antigo vagão ferroviário histórico do Contestado.',
    descricaoCompleta: 'Instalado junto ao complexo tombado da histórica Estação Ferroviária de Marcílio Dias, inaugurada no início do século XX e polo crucial da história da Guerra do Contestado e do ciclo da madeira. Oferece cafés especiais, tortas artesanais, chopp artesanal produzido com lúpulo catarinense e uma seleção refinada de queijos, geleias e embutidos de produtores rurais de Canoinhas.',
    endereco: 'Pátio da Estação Ferroviária, Distrito de Marcílio Dias',
    bairroDistrito: 'Distrito de Marcílio Dias, Canoinhas - SC',
    contato: '(47) 98801-9933',
    emailContato: 'contato@estacaomarciliodias.com.br',
    horarios: 'Terça a Domingo: 13h30 às 20h30',
    id_dono: 'user_luciane',
    nome_dono: 'Coletivo Amigos do Patrimônio Ferroviário',
    lat: -26.2085,
    lng: -50.3340,
    preco_medio: 'R$ 48 / combo café colonial com salgado e torta artesanal',
    capacidade: 45,
    fotos: [
      '/src/assets/images/gastronomia_colonial_1794441253419.jpg',
      '/src/assets/images/pousada_fazenda_1794441254481.jpg'
    ],
    destaques: [
      'Mesas no vagão restaurado da ferrovia',
      'Exposição histórica fotográfica sobre a Estrada de Ferro SP-RG',
      'Pães de fermentação natural e cucas artesanais',
      'Armazém com mel, erva-mate artesanal e queijos coloniais',
      'Ponto de encontro oficial de cicloturistas da região'
    ],
    nota: 4.9,
    num_avaliacoes: 38,
  },
];

const INITIAL_ATRATIVOS: AtrativoEvento[] = [
  {
    id: 'atr_morrodocristo',
    titulo: 'Mirante & Parque do Morro do Cristo',
    tipo: 'atrativo',
    categoria: 'natureza',
    categoriaLabel: 'Natureza & Mirante Panorâmico',
    descricao: 'Monumento ao Cristo e vista de 360 graus de toda a cidade de Canoinhas e dos vales de araucárias.',
    local: 'Acesso pelo Alto da Colina - Bairro Alto das Palmeiras',
    lat: -26.1850,
    lng: -50.3800,
    horario: 'Aberto 24h (Recomendado visitação entre 07h e 19h)',
    preco: 'Entrada Franca',
    foto: '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg',
  },
  {
    id: 'atr_estacaohistorica',
    titulo: 'Estação Ferroviária Marcílio Dias (Patrimônio Histórico)',
    tipo: 'atrativo',
    categoria: 'cultural',
    categoriaLabel: 'História & Memória do Contestado',
    descricao: 'Construída em 1913, é um dos maiores patrimônios arquitetônicos da ferrovia São Paulo - Rio Grande em SC.',
    local: 'Praça da Estação, Distrito de Marcílio Dias - Canoinhas, SC',
    lat: -26.2085,
    lng: -50.3340,
    horario: 'Terça a Domingo: 09h às 18h',
    preco: 'Entrada Franca',
    foto: '/src/assets/images/gastronomia_colonial_1794441253419.jpg',
  },
  {
    id: 'atr_florestanacional',
    titulo: 'Trilha das Araucárias Gigantes',
    tipo: 'atrativo',
    categoria: 'natureza',
    categoriaLabel: 'Ecoturismo & Biodiversidade',
    descricao: 'Floresta de pinheiros-do-Paraná centenários, trilha de interpretação ambiental e observação da gralha-azul.',
    local: 'Estrada Ecológica dos Pinheiros, Limite Canoinhas - Três Barras',
    lat: -26.1800,
    lng: -50.3000,
    horario: 'Quarta a Domingo: 08h às 16h30',
    preco: 'R$ 15 / pessoa',
    foto: '/src/assets/images/trilha_cachoeira_1794441254975.jpg',
  },
  {
    id: 'eve_festaervamate',
    titulo: 'FESMATE - Festa Estadual da Erva-Mate & Sabores do Campo',
    tipo: 'evento',
    categoria: 'cultural',
    categoriaLabel: 'Cultura & Tradição da Erva-Mate',
    descricao: 'A maior celebração da cultura do chimarrão e do tropeirismo de Canoinhas: gastronomia, rodeio, feira agro e shows.',
    local: 'Parque de Exposições Ouro Verde, Canoinhas - SC',
    lat: -26.1720,
    lng: -50.3950,
    data_inicio: '2026-11-20',
    data_fim: '2026-11-23',
    horario: 'Abertura dos portões às 10h',
    preco: 'Acesso diurno gratuito ao parque',
    foto: '/src/assets/images/gastronomia_colonial_1794441253419.jpg',
  },
  {
    id: 'eve_cicloturismo',
    titulo: 'Desafio Rota das Fazendas de Cicloturismo',
    tipo: 'evento',
    categoria: 'rural',
    categoriaLabel: 'Esporte & Roteiro Rural',
    descricao: 'Passeio ciclístico de 42 km passando pelas fazendas coloniais históricas de Taunay, Marcílio Dias e Rio dos Pardos.',
    local: 'Largada na Estação Marcílio Dias',
    lat: -26.2085,
    lng: -50.3340,
    data_inicio: '2026-11-28',
    data_fim: '2026-11-28',
    horario: 'Largada às 07h30',
    preco: 'R$ 60 (com almoço na Cantina Dona Frida incluso)',
    foto: '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg',
  },
];

const INITIAL_ROTEIROS: Roteiro[] = [
  {
    id: 'rot_fimdesemana',
    titulo: 'Fim de Semana Rural em Canoinhas',
    subtitulo: '2 Dias de descanso nas araucárias, gastronomia colonial e banho de cachoeira',
    duracao: '2 dias (Final de semana)',
    dificuldade: 'Fácil para Família',
    descricao: 'Roteiro desenhado sob medida para famílias e casais (como nossa persona Carla) que desejam desacelerar da rotina urbana e viver o melhor do Planalto Norte Catarinense. Combina hospedagem de charme em fazenda, almoço com quirera e cuca fresca, caminhada ecológica leve e história viva da ferrovia.',
    foto: '/src/assets/images/hero_canoinhas_rural_1794441252491.jpg',
    foco: 'Gastronomia típica, descanso rural e conexão com produtores locais',
    paradas: [
      {
        ordem: 1,
        titulo: 'Boas-vindas com Chimarrão na Fazenda Serra Negra',
        tipo: 'negocio',
        id_referencia: 'neg_serranegra',
        descricao: 'Chegada matinal a Canoinhas. Visita ao engenho histórico de erva-mate, carinho nos animais de fazenda e degustação de chimarrão.',
        horario_sugerido: 'Sábado - 09:30',
        lat: -26.2120,
        lng: -50.3410,
      },
      {
        ordem: 2,
        titulo: 'Almoço Tropeiro Colonial na Cantina Dona Frida',
        tipo: 'negocio',
        id_referencia: 'neg_donafrida',
        descricao: 'Banquete típico com quirera lapeana com costelinha suína defumada, pierogi e cuca artesanal ainda morna saindo do forno a lenha.',
        horario_sugerido: 'Sábado - 12:30',
        lat: -26.1550,
        lng: -50.3380,
      },
      {
        ordem: 3,
        titulo: 'Pôr do Sol no Mirante do Morro do Cristo',
        tipo: 'mirante',
        id_referencia: 'atr_morrodocristo',
        descricao: 'Vista panorâmica inesquecível da cidade de Canoinhas emoldurada pelo relevo ondulado e os pinheiros nativos.',
        horario_sugerido: 'Sábado - 17:30',
        lat: -26.1850,
        lng: -50.3800,
      },
      {
        ordem: 4,
        titulo: 'Check-in e Noite de Lareira na Pousada Vale das Araucárias',
        tipo: 'negocio',
        id_referencia: 'neg_valedasaraucarias',
        descricao: 'Acomodação no chalé rústico privativo, vinho colonial da região e descanso sob o céu estrelado do campo.',
        horario_sugerido: 'Sábado - 19:30',
        lat: -26.2312,
        lng: -50.4420,
      },
      {
        ordem: 5,
        titulo: 'Trilha Ecológica no Eco-Parque das Cachoeiras',
        tipo: 'atrativo',
        id_referencia: 'neg_saltoecoparque',
        descricao: 'Caminhada pelas passarelas de madeira no Salto do Canoinhas e banho revigorante nas piscinas naturais.',
        horario_sugerido: 'Domingo - 10:00',
        lat: -26.1210,
        lng: -50.4690,
      },
      {
        ordem: 6,
        titulo: 'Café da Tarde na Estação Ferroviária Marcílio Dias',
        tipo: 'negocio',
        id_referencia: 'neg_estacaomarcilio',
        descricao: 'Encerramento da viagem com café no antigo vagão ferroviário e compra de queijos, pães e doces coloniais para levar para casa.',
        horario_sugerido: 'Domingo - 15:30',
        lat: -26.2085,
        lng: -50.3340,
      },
    ],
  },
  {
    id: 'rot_saborescoloniais',
    titulo: 'Circuito dos Sabores Coloniais & Erva-Mate',
    subtitulo: '1 Dia de imersão gastronômica pelas receitas de raiz de Canoinhas',
    duracao: '1 dia (8 horas)',
    dificuldade: 'Leve',
    descricao: 'Roteiro dedicado aos apreciadores da boa culinária caipira, tropeira e colonial. Passa por queijarias familiares, fazendas centenárias produtoras de erva-mate sombreada e bistrôs que valorizam insumos 100% locais.',
    foto: '/src/assets/images/gastronomia_colonial_1794441253419.jpg',
    foco: 'Turismo gastronômico, valorização do produtor local (ODS 8 e ODS 12)',
    paradas: [
      {
        ordem: 1,
        titulo: 'Café da Manhã e Museu da Erva-Mate na Fazenda Serra Negra',
        tipo: 'negocio',
        id_referencia: 'neg_serranegra',
        descricao: 'Roda de chimarrão com pinhão assado e histórias dos tropeiros.',
        horario_sugerido: '09:00',
        lat: -26.2120,
        lng: -50.3410,
      },
      {
        ordem: 2,
        titulo: 'Almoço Colonial com Quirera na Cantina Dona Frida',
        tipo: 'negocio',
        id_referencia: 'neg_donafrida',
        descricao: 'Degustação do prato símbolo da região e sobremesas coloniais.',
        horario_sugerido: '12:00',
        lat: -26.1550,
        lng: -50.3380,
      },
      {
        ordem: 3,
        titulo: 'Armazém de Produtos Coloniais da Estação Marcílio Dias',
        tipo: 'negocio',
        id_referencia: 'neg_estacaomarcilio',
        descricao: 'Feira direta do produtor com queijos maturados, mel silvestre e licores artesanais.',
        horario_sugerido: '15:30',
        lat: -26.2085,
        lng: -50.3340,
      },
    ],
  },
  {
    id: 'rot_trilhasecologicas',
    titulo: 'Expedição Ecológica das Araucárias & Cachoeiras',
    subtitulo: '1 Dia de caminhada na natureza preservada e ar puro',
    duracao: '1 dia (7 horas)',
    dificuldade: 'Moderada',
    descricao: 'Roteiro ativo com caminhadas pelas florestas de araucárias, observação da fauna nativa do Planalto Norte Catarinense e paradas em cachoeiras de águas limpas.',
    foto: '/src/assets/images/trilha_cachoeira_1794441254975.jpg',
    foco: 'Ecoturismo sustentável, trilhas guiadas e conservação ambiental (ODS 11)',
    paradas: [
      {
        ordem: 1,
        titulo: 'Trilha das Araucárias Gigantes',
        tipo: 'atrativo',
        id_referencia: 'atr_florestanacional',
        descricao: 'Caminhada guiada de 2,5 km entre espécimes milenares de Pinheiro-do-Paraná.',
        horario_sugerido: '08:30',
        lat: -26.1800,
        lng: -50.3000,
      },
      {
        ordem: 2,
        titulo: 'Salto do Canoinhas e Cachoeiras',
        tipo: 'negocio',
        id_referencia: 'neg_saltoecoparque',
        descricao: 'Trilha das 3 cachoeiras com almoço piquenique e banho de rio.',
        horario_sugerido: '11:30',
        lat: -26.1210,
        lng: -50.4690,
      },
      {
        ordem: 3,
        titulo: 'Contemplação no Morro do Cristo',
        tipo: 'mirante',
        id_referencia: 'atr_morrodocristo',
        descricao: 'Visual panorâmico do pôr do sol sobre os pinheirais.',
        horario_sugerido: '17:00',
        lat: -26.1850,
        lng: -50.3800,
      },
    ],
  },
];

const INITIAL_RESERVAS: Reserva[] = [
  {
    id: 'res_001',
    id_usuario: 'user_carla',
    nome_usuario: 'Carla Silveira Mendes',
    email_usuario: 'carla.mendes@email.com',
    telefone_usuario: '(41) 99823-4410',
    id_negocio: 'neg_valedasaraucarias',
    nome_negocio: 'Pousada Rural Vale das Araucárias',
    categoria_negocio: 'pousada',
    data: '2026-11-21',
    hora: '14:00',
    numero_pessoas: 4,
    tipo_reserva: 'hospedagem',
    observacoes: 'Família com 2 adultos e 2 crianças (7 e 10 anos). Gostaríamos do chalé com lareira.',
    status: 'confirmada',
    data_criacao: '2026-11-09T14:20:00Z',
    tem_avaliacao: true,
  },
  {
    id: 'res_002',
    id_usuario: 'user_carla',
    nome_usuario: 'Carla Silveira Mendes',
    email_usuario: 'carla.mendes@email.com',
    telefone_usuario: '(41) 99823-4410',
    id_negocio: 'neg_donafrida',
    nome_negocio: 'Cantina & Café Colonial Dona Frida',
    categoria_negocio: 'restaurante',
    data: '2026-11-21',
    hora: '12:30',
    numero_pessoas: 4,
    tipo_reserva: 'almoco_colonial',
    observacoes: 'Mesa perto da janela com vista para os pinheirais.',
    status: 'confirmada',
    data_criacao: '2026-11-09T14:40:00Z',
    tem_avaliacao: true,
  },
  {
    id: 'res_003',
    id_usuario: 'user_carla',
    nome_usuario: 'Carla Silveira Mendes',
    email_usuario: 'carla.mendes@email.com',
    telefone_usuario: '(41) 99823-4410',
    id_negocio: 'neg_serranegra',
    nome_negocio: 'Fazenda Histórica & Agroecológica Serra Negra',
    categoria_negocio: 'propriedade_rural',
    data: '2026-11-22',
    hora: '10:00',
    numero_pessoas: 4,
    tipo_reserva: 'experiencia_rural',
    observacoes: 'Passeio de charrete e colheita agroecológica para as crianças.',
    status: 'confirmada',
    data_criacao: '2026-11-10T11:15:00Z',
    tem_avaliacao: false,
  },
  {
    id: 'res_004',
    id_usuario: 'user_visitante2',
    nome_usuario: 'Rodrigo Antunes',
    email_usuario: 'rodrigo.antunes@gmail.com',
    telefone_usuario: '(47) 98455-1199',
    id_negocio: 'neg_valedasaraucarias',
    nome_negocio: 'Pousada Rural Vale das Araucárias',
    categoria_negocio: 'pousada',
    data: '2026-11-28',
    hora: '15:00',
    numero_pessoas: 2,
    tipo_reserva: 'hospedagem',
    observacoes: 'Comemoração de aniversário de casamento.',
    status: 'pendente',
    data_criacao: '2026-11-11T09:30:00Z',
    tem_avaliacao: false,
  },
  {
    id: 'res_005',
    id_usuario: 'user_visitante3',
    nome_usuario: 'Mariana Duarte',
    email_usuario: 'mariana.duarte@hotmail.com',
    telefone_usuario: '(41) 99100-3321',
    id_negocio: 'neg_donafrida',
    nome_negocio: 'Cantina & Café Colonial Dona Frida',
    categoria_negocio: 'restaurante',
    data: '2026-11-29',
    hora: '13:00',
    numero_pessoas: 6,
    tipo_reserva: 'almoco_colonial',
    observacoes: 'Grupo de amigos pedalando a rota das fazendas.',
    status: 'pendente',
    data_criacao: '2026-11-11T13:45:00Z',
    tem_avaliacao: false,
  },
];

const INITIAL_AVALIACOES: Avaliacao[] = [
  {
    id: 'aval_001',
    id_reserva: 'res_001',
    id_usuario: 'user_carla',
    nome_usuario: 'Carla Silveira Mendes',
    id_negocio: 'neg_valedasaraucarias',
    nome_negocio: 'Pousada Rural Vale das Araucárias',
    nota: 5,
    comentario: 'Experiência maravilhosa! Fomos de Curitiba com as crianças e ficamos encantados com o silêncio, o acolhimento do Nicolas e da família, o chalé quentinho com lareira e aquele café colonial inesquecível no fogão a lenha. As crianças amaram colher pinhão e caminhar pela trilha. Voltaremos com certeza!',
    data: '2026-11-10',
    resposta_dono: 'Muito obrigado, Carla! Foi uma alegria receber você e sua família no Vale das Araucárias. Esperamos vocês na época do morango!',
    data_resposta: '2026-11-10',
  },
  {
    id: 'aval_002',
    id_reserva: 'res_002',
    id_usuario: 'user_carla',
    nome_usuario: 'Carla Silveira Mendes',
    id_negocio: 'neg_donafrida',
    nome_negocio: 'Cantina & Café Colonial Dona Frida',
    nota: 5,
    comentario: 'A melhor quirera lapeana com costelinha suína que já comi na vida! A cuca alemã assada na hora com queijo colonial é divina. Atendimento com muito carinho e ambiente rural acolhedor.',
    data: '2026-11-10',
    resposta_dono: 'Ficamos muito felizes que gostaram da nossa quirera e das cucas, Carla! Nossa receita é herança de 4 gerações aqui em Canoinhas.',
    data_resposta: '2026-11-11',
  },
  {
    id: 'aval_003',
    id_reserva: 'res_antiga_01',
    id_usuario: 'user_marcos',
    nome_usuario: 'Marcos Vinícius T.',
    id_negocio: 'neg_serranegra',
    nome_negocio: 'Fazenda Histórica & Agroecológica Serra Negra',
    nota: 5,
    comentario: 'Uma verdadeira aula de história viva da região do Contestado e do cultivo tradicional da erva-mate. Passeio de charrete muito relaxante sob as araucárias. Produto agroecológico de verdade!',
    data: '2026-11-04',
  },
  {
    id: 'aval_004',
    id_reserva: 'res_antiga_02',
    id_usuario: 'user_juliana',
    nome_usuario: 'Juliana Hoffmann',
    id_negocio: 'neg_estacaomarcilio',
    nome_negocio: 'Bistrô & Armazém Cultural Estação Marcílio Dias',
    nota: 5,
    comentario: 'Tomar café da tarde dentro de um vagão restaurado é uma viagem no tempo! Produtos artesanais da colônia de altíssima qualidade.',
    data: '2026-11-02',
  },
];

interface DatabaseSchema {
  usuarios: Usuario[];
  negocios: Negocio[];
  atrativos_eventos: AtrativoEvento[];
  roteiros: Roteiro[];
  reservas: Reserva[];
  avaliacoes: Avaliacao[];
}

export class ConectaDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    this.ensureDirectory();
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.negocios && parsed.reservas) {
          return parsed;
        }
      } catch (err) {
        console.error('Erro ao ler banco de dados JSON, reinicializando com dados padrão:', err);
      }
    }

    const defaultData: DatabaseSchema = {
      usuarios: INITIAL_USUARIOS,
      negocios: INITIAL_NEGOCIOS,
      atrativos_eventos: INITIAL_ATRATIVOS,
      roteiros: INITIAL_ROTEIROS,
      reservas: INITIAL_RESERVAS,
      avaliacoes: INITIAL_AVALIACOES,
    };

    this.saveDatabase(defaultData);
    return defaultData;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    this.ensureDirectory();
    const data = dataToSave || this.data;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Calculate distance between two coordinates in Kilometers (Haversine Formula)
  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }

  // Recalculate rating and review count for a business
  private updateBusinessRating(businessId: string) {
    const reviews = this.data.avaliacoes.filter((a) => a.id_negocio === businessId);
    const business = this.data.negocios.find((n) => n.id === businessId);
    if (business) {
      if (reviews.length === 0) {
        business.nota = 5.0;
        business.num_avaliacoes = 0;
      } else {
        const sum = reviews.reduce((acc, r) => acc + r.nota, 0);
        business.nota = Number((sum / reviews.length).toFixed(1));
        business.num_avaliacoes = reviews.length;
      }
    }
  }

  // NEGOCIOS
  public getNegocios(options?: {
    categoria?: string;
    busca?: string;
    lat?: number;
    lng?: number;
    raioKm?: number;
    notaMinima?: number;
  }): Negocio[] {
    let list = [...this.data.negocios];

    if (options?.categoria && options.categoria !== 'todos') {
      list = list.filter((n) => n.categoria === options.categoria);
    }

    if (options?.busca && options.busca.trim() !== '') {
      const q = options.busca.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.nome.toLowerCase().includes(q) ||
          n.descricao.toLowerCase().includes(q) ||
          n.endereco.toLowerCase().includes(q) ||
          n.destaques.some((d) => d.toLowerCase().includes(q))
      );
    }

    if (options?.notaMinima && options.notaMinima > 0) {
      list = list.filter((n) => n.nota >= options.notaMinima!);
    }

    // Geolocation distance calculation
    const userLat = options?.lat ?? CANOINHAS_CENTER.lat;
    const userLng = options?.lng ?? CANOINHAS_CENTER.lng;

    list = list.map((n) => ({
      ...n,
      distanciaKm: this.calculateDistance(userLat, userLng, n.lat, n.lng),
    }));

    if (options?.raioKm && options.raioKm > 0) {
      list = list.filter((n) => (n.distanciaKm || 0) <= options.raioKm!);
    }

    return list;
  }

  public getNegocioById(id: string): { negocio: Negocio; avaliacoes: Avaliacao[] } | null {
    const negocio = this.data.negocios.find((n) => n.id === id);
    if (!negocio) return null;
    const avaliacoes = this.data.avaliacoes.filter((a) => a.id_negocio === id);
    return { negocio, avaliacoes };
  }

  public createNegocio(data: Omit<Negocio, 'id' | 'nota' | 'num_avaliacoes'>): Negocio {
    const id = 'neg_' + Date.now().toString(36);
    const novo: Negocio = {
      ...data,
      id,
      nota: 5.0,
      num_avaliacoes: 0,
      destaques: data.destaques || [],
      fotos: data.fotos && data.fotos.length > 0 ? data.fotos : ['/src/assets/images/hero_canoinhas_rural_1794441252491.jpg'],
    };
    this.data.negocios.push(novo);
    this.saveDatabase();
    return novo;
  }

  public updateNegocio(id: string, updates: Partial<Negocio>): Negocio | null {
    const index = this.data.negocios.findIndex((n) => n.id === id);
    if (index === -1) return null;
    this.data.negocios[index] = {
      ...this.data.negocios[index],
      ...updates,
    };
    this.saveDatabase();
    return this.data.negocios[index];
  }

  // ATRATIVOS E EVENTOS
  public getAtrativosEventos(options?: {
    tipo?: string;
    categoria?: string;
    busca?: string;
    lat?: number;
    lng?: number;
  }): AtrativoEvento[] {
    let list = [...this.data.atrativos_eventos];

    if (options?.tipo && options.tipo !== 'todos') {
      list = list.filter((item) => item.tipo === options.tipo);
    }

    if (options?.categoria && options.categoria !== 'todos') {
      list = list.filter((item) => item.categoria === options.categoria);
    }

    if (options?.busca && options.busca.trim() !== '') {
      const q = options.busca.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.titulo.toLowerCase().includes(q) ||
          item.descricao.toLowerCase().includes(q) ||
          item.local.toLowerCase().includes(q)
      );
    }

    const userLat = options?.lat ?? CANOINHAS_CENTER.lat;
    const userLng = options?.lng ?? CANOINHAS_CENTER.lng;

    list = list.map((item) => ({
      ...item,
      distanciaKm: this.calculateDistance(userLat, userLng, item.lat, item.lng),
    }));

    return list;
  }

  public createAtrativoEvento(data: Omit<AtrativoEvento, 'id'>): AtrativoEvento {
    const id = (data.tipo === 'evento' ? 'eve_' : 'atr_') + Date.now().toString(36);
    const novo: AtrativoEvento = {
      ...data,
      id,
    };
    this.data.atrativos_eventos.push(novo);
    this.saveDatabase();
    return novo;
  }

  // ROTEIROS
  public getRoteiros(): Roteiro[] {
    return this.data.roteiros;
  }

  public getRoteiroById(id: string): Roteiro | null {
    return this.data.roteiros.find((r) => r.id === id) || null;
  }

  // RESERVAS
  public getReservas(options?: { id_usuario?: string; id_negocio?: string }): Reserva[] {
    let list = [...this.data.reservas];
    if (options?.id_usuario) {
      list = list.filter((r) => r.id_usuario === options.id_usuario);
    }
    if (options?.id_negocio) {
      list = list.filter((r) => r.id_negocio === options.id_negocio);
    }
    return list.sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime());
  }

  public createReserva(data: Omit<Reserva, 'id' | 'status' | 'data_criacao' | 'tem_avaliacao'>): Reserva {
    const id = 'res_' + Date.now().toString(36);
    const nova: Reserva = {
      ...data,
      id,
      status: 'pendente',
      data_criacao: new Date().toISOString(),
      tem_avaliacao: false,
    };
    this.data.reservas.unshift(nova);
    this.saveDatabase();
    return nova;
  }

  public updateReservaStatus(id: string, status: Reserva['status']): Reserva | null {
    const reserva = this.data.reservas.find((r) => r.id === id);
    if (!reserva) return null;
    reserva.status = status;
    this.saveDatabase();
    return reserva;
  }

  // AVALIACOES
  public getAvaliacoes(options?: { id_negocio?: string; id_usuario?: string }): Avaliacao[] {
    let list = [...this.data.avaliacoes];
    if (options?.id_negocio) {
      list = list.filter((a) => a.id_negocio === options.id_negocio);
    }
    if (options?.id_usuario) {
      list = list.filter((a) => a.id_usuario === options.id_usuario);
    }
    return list.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  public createAvaliacao(data: {
    id_reserva: string;
    id_usuario: string;
    nome_usuario: string;
    id_negocio: string;
    nota: number;
    comentario: string;
  }): Avaliacao {
    // RN02: Cada avaliação deve estar ligada a uma reserva
    const id = 'aval_' + Date.now().toString(36);
    const negocio = this.data.negocios.find((n) => n.id === data.id_negocio);
    const nova: Avaliacao = {
      ...data,
      id,
      nome_negocio: negocio ? negocio.nome : 'Negócio Rural',
      data: new Date().toISOString().split('T')[0],
    };

    this.data.avaliacoes.unshift(nova);

    // Mark reserva as having review
    const reserva = this.data.reservas.find((r) => r.id === data.id_reserva);
    if (reserva) {
      reserva.tem_avaliacao = true;
    }

    this.updateBusinessRating(data.id_negocio);
    this.saveDatabase();
    return nova;
  }

  public responderAvaliacao(id: string, resposta: string): Avaliacao | null {
    const avaliacao = this.data.avaliacoes.find((a) => a.id === id);
    if (!avaliacao) return null;
    avaliacao.resposta_dono = resposta;
    avaliacao.data_resposta = new Date().toISOString().split('T')[0];
    this.saveDatabase();
    return avaliacao;
  }

  // USUARIOS
  public getUsuarios(): Usuario[] {
    return this.data.usuarios;
  }

  public getUsuarioById(id: string): Usuario | null {
    return this.data.usuarios.find((u) => u.id === id) || null;
  }

  // STATS & INDICATORS FOR ODS
  public getStats(): StatsResponse {
    const totalNegocios = this.data.negocios.length;
    const totalAtrativos = this.data.atrativos_eventos.length;
    const totalRoteiros = this.data.roteiros.length;
    const totalReservas = this.data.reservas.length;
    const reservasConfirmadas = this.data.reservas.filter((r) => r.status === 'confirmada').length;
    const totalAvaliacoes = this.data.avaliacoes.length;
    const mediaGeralNotas =
      totalNegocios > 0
        ? Number(
            (
              this.data.negocios.reduce((acc, n) => acc + n.nota, 0) / totalNegocios
            ).toFixed(1)
          )
        : 5.0;

    return {
      totalNegocios,
      totalAtrativos,
      totalRoteiros,
      totalReservas,
      reservasConfirmadas,
      totalAvaliacoes,
      mediaGeralNotas,
    };
  }
}

export const db = new ConectaDatabase();
