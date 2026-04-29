import express from 'express';
import dotenv from 'dotenv';
import { AgentFactory } from './factory';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

const factory = new AgentFactory();

// Default agents for demo
factory.createAgent('CONCIERGE', {
  name: 'Alfred',
  personality: 'Helpful, formal, and knowledgeable about the Diamond District.',
  parcelId: 'GENESIS_0_0'
});

factory.createAgent('MYSTERY_SHOPPER', {
  name: 'Sherlock',
  personality: 'Critical, observant, and looking for high-quality UGC.',
  parcelId: 'GENESIS_1_1'
});

app.post('/agents', (req, res) => {
  const { type, config } = req.body;
  try {
    const agent = factory.createAgent(type, config);
    res.json({ id: agent.id, type: agent.type });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/agents', (req, res) => {
  res.json(factory.getAgents().map(a => ({ id: a.id, type: a.type, state: a.state, config: a.config })));
});

app.get('/agents/:id', (req, res) => {
  const { id } = req.params;
  const agent = factory.getAgent(id);
  if (!agent) return res.status(404).send('Agent not found');
  res.json({ id: agent.id, type: agent.type, state: agent.state, config: agent.config });
});

app.post('/agents/:id/interact', async (req, res) => {
  const { id } = req.params;
  const { message, playerId } = req.body;
  const agent = factory.getAgent(id);
  if (!agent) return res.status(404).send('Agent not found');
  
  try {
    const response = await agent.interact(message, playerId);
    res.json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`AI Agent service listening at http://localhost:${port}`);

  // Start agent update loop
  setInterval(() => {
    factory.getAgents().forEach(agent => agent.update());
  }, 5000); // Update every 5 seconds
});
