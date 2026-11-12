import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, CANOINHAS_CENTER } from './src/server/database.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Endpoints for Rota dos Ervais

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      project: 'ROTA DOS ERVAIS - Canoinhas SC',
      ods: ['ODS 8 - Trabalho Decente', 'ODS 11 - Cidades Sustentáveis', 'ODS 12 - Consumo Responsável'],
    });
  });

  // NEGOCIOS (Pousadas, Restaurantes e Propriedades Rurais)
  app.get('/api/negocios', (req, res) => {
    try {
      const { categoria, busca, lat, lng, raio, nota_min } = req.query;
      const list = db.getNegocios({
        categoria: categoria ? String(categoria) : undefined,
        busca: busca ? String(busca) : undefined,
        lat: lat ? parseFloat(String(lat)) : undefined,
        lng: lng ? parseFloat(String(lng)) : undefined,
        raioKm: raio ? parseFloat(String(raio)) : undefined,
        notaMinima: nota_min ? parseFloat(String(nota_min)) : undefined,
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao buscar negócios' });
    }
  });

  app.get('/api/negocios/:id', (req, res) => {
    try {
      const result = db.getNegocioById(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Negócio não encontrado' });
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/negocios', (req, res) => {
    try {
      const created = db.createNegocio(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Dados inválidos' });
    }
  });

  app.put('/api/negocios/:id', (req, res) => {
    try {
      const updated = db.updateNegocio(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Negócio não encontrado para atualização' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ATRATIVOS E EVENTOS (RF01)
  app.get('/api/atrativos-eventos', (req, res) => {
    try {
      const { tipo, categoria, busca, lat, lng } = req.query;
      const list = db.getAtrativosEventos({
        tipo: tipo ? String(tipo) : undefined,
        categoria: categoria ? String(categoria) : undefined,
        busca: busca ? String(busca) : undefined,
        lat: lat ? parseFloat(String(lat)) : undefined,
        lng: lng ? parseFloat(String(lng)) : undefined,
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/atrativos-eventos', (req, res) => {
    try {
      const created = db.createAtrativoEvento(req.body);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ROTEIROS (RF02)
  app.get('/api/roteiros', (_req, res) => {
    try {
      const list = db.getRoteiros();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/roteiros/:id', (req, res) => {
    try {
      const item = db.getRoteiroById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Roteiro não encontrado' });
      }
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // RESERVAS (RF03)
  app.get('/api/reservas', (req, res) => {
    try {
      const { id_usuario, id_negocio } = req.query;
      const list = db.getReservas({
        id_usuario: id_usuario ? String(id_usuario) : undefined,
        id_negocio: id_negocio ? String(id_negocio) : undefined,
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reservas', (req, res) => {
    try {
      const { id_usuario, nome_usuario, email_usuario, telefone_usuario, id_negocio, nome_negocio, categoria_negocio, data, hora, numero_pessoas, tipo_reserva, observacoes } = req.body;
      if (!id_negocio || !data || !numero_pessoas || !nome_usuario || !email_usuario) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes para solicitação de reserva' });
      }
      const nova = db.createReserva({
        id_usuario: id_usuario || 'user_anonimo',
        nome_usuario,
        email_usuario,
        telefone_usuario: telefone_usuario || '',
        id_negocio,
        nome_negocio: nome_negocio || 'Estabelecimento Rural',
        categoria_negocio: categoria_negocio || 'propriedade_rural',
        data,
        hora: hora || '12:00',
        numero_pessoas: Number(numero_pessoas),
        tipo_reserva: tipo_reserva || 'experiencia_rural',
        observacoes: observacoes || '',
      });
      res.status(201).json(nova);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/reservas/:id/status', (req, res) => {
    try {
      const { status } = req.body;
      if (!['pendente', 'confirmada', 'recusada', 'concluida'].includes(status)) {
        return res.status(400).json({ error: 'Status de reserva inválido' });
      }
      const updated = db.updateReservaStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AVALIACOES (RF04 & RN02)
  app.get('/api/avaliacoes', (req, res) => {
    try {
      const { id_negocio, id_usuario } = req.query;
      const list = db.getAvaliacoes({
        id_negocio: id_negocio ? String(id_negocio) : undefined,
        id_usuario: id_usuario ? String(id_usuario) : undefined,
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/avaliacoes', (req, res) => {
    try {
      const { id_reserva, id_usuario, nome_usuario, id_negocio, nota, comentario } = req.body;
      if (!id_reserva || !id_negocio || !nota || !comentario) {
        return res.status(400).json({ error: 'Nota, comentário e reserva vinculada são obrigatórios' });
      }
      const avaliacao = db.createAvaliacao({
        id_reserva,
        id_usuario: id_usuario || 'user_carla',
        nome_usuario: nome_usuario || 'Visitante',
        id_negocio,
        nota: Number(nota),
        comentario,
      });
      res.status(201).json(avaliacao);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/avaliacoes/:id/resposta', (req, res) => {
    try {
      const { resposta } = req.body;
      if (!resposta || resposta.trim() === '') {
        return res.status(400).json({ error: 'A resposta não pode estar vazia' });
      }
      const updated = db.responderAvaliacao(req.params.id, resposta.trim());
      if (!updated) {
        return res.status(404).json({ error: 'Avaliação não encontrada' });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // USUARIOS & SEED SWITCHER
  app.get('/api/usuarios', (_req, res) => {
    res.json(db.getUsuarios());
  });

  // INDICADORES & STATS (Cunho Social e ODS 8, 11, 12)
  app.get('/api/stats', (_req, res) => {
    res.json(db.getStats());
  });

  // VITE INTEGRATION
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`ROTA DOS ERVAIS rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar servidor:', err);
  process.exit(1);
});
