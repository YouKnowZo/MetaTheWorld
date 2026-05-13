import { OpenAI } from 'openai';

export enum AgentState {
  IDLE = 'IDLE',
  PATROLLING = 'PATROLLING',
  CONVERSING = 'CONVERSING',
  REPORTING = 'REPORTING'
}

export interface AgentConfig {
  name: string;
  personality: string;
  parcelId?: string;
}

export abstract class BaseAgent {
  public id: string;
  public state: AgentState = AgentState.IDLE;
  protected openai: OpenAI;

  constructor(public type: string, public config: AgentConfig) {
    this.id = Math.random().toString(36).substring(7);
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY || 'mock-key' 
    });
  }

  abstract interact(message: string, playerId: string): Promise<string>;
  abstract update(): void;
}

export class ConciergeAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super('CONCIERGE', config);
  }

  async interact(message: string, playerId: string): Promise<string> {
    this.state = AgentState.CONVERSING;
    
    // In a real environment, this would call OpenAI
    // For now, if no API key, return a mock response
    if (process.env.OPENAI_API_KEY) {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are ${this.config.name}, a virtual concierge in the MTW Metaverse. ${this.config.personality}` },
          { role: "user", content: message }
        ]
      });
      this.state = AgentState.IDLE;
      return response.choices[0].message.content || "I'm sorry, I couldn't understand that.";
    } else {
      this.state = AgentState.IDLE;
      return `[MOCK RESPONSE] Hello, I am ${this.config.name}. How can I assist you in the Meta The World?`;
    }
  }

  update() {
    // Logic for patrolling or being helpful
  }
}

export class MysteryShopperAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super('MYSTERY_SHOPPER', config);
  }

  async interact(message: string, playerId: string): Promise<string> {
    this.state = AgentState.CONVERSING;
    
    if (process.env.OPENAI_API_KEY) {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are a mystery shopper observing parcels in the MTW Metaverse. You are ${this.config.personality}` },
          { role: "user", content: message }
        ]
      });
      this.state = AgentState.IDLE;
      return response.choices[0].message.content || "Interesting...";
    } else {
      this.state = AgentState.IDLE;
      return `[MOCK RESPONSE] I'm observing the quality of this parcel. It looks... interesting.`;
    }
  }

  update() {
    // Logic for visiting parcels and generating reports
  }
}
