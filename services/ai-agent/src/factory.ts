import { BaseAgent, ConciergeAgent, MysteryShopperAgent, AgentConfig } from './agent';

export class AgentFactory {
  private agents: Map<string, BaseAgent> = new Map();

  createAgent(type: string, config: AgentConfig): BaseAgent {
    let agent: BaseAgent;
    if (type === 'CONCIERGE') {
      agent = new ConciergeAgent(config);
    } else if (type === 'MYSTERY_SHOPPER') {
      agent = new MysteryShopperAgent(config);
    } else {
      throw new Error(`Unknown agent type: ${type}`);
    }
    this.agents.set(agent.id, agent);
    return agent;
  }

  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }

  getAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }

  removeAgent(id: string): boolean {
    return this.agents.delete(id);
  }
}
