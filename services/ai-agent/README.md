# AI Agent Service

This service manages AI-driven agents within the Meta The World metaverse. These agents can perform various roles such as concierges, mystery shoppers, or other specialized functions, interacting with players and the environment.

## Features:

- **Agent Creation and Management**: Dynamically create and manage different types of AI agents.
- **Agent States**: Agents can transition between states like IDLE, PATROLLING, CONVERSING, and REPORTING.
- **OpenAI Integration**: Utilizes OpenAI's API for natural language interactions, allowing agents to respond contextually to user messages.
- **Mock Responses**: Provides mock responses when an OpenAI API key is not configured, facilitating local development.
- **Scheduled Updates**: Agents periodically update their internal state and perform actions (e.g., patrolling, reporting).

## Technologies:

- **TypeScript**: Primary language for development.
- **Express.js**: For handling HTTP API endpoints.
- **OpenAI Node.js Library**: For integrating with OpenAI's large language models.
- **dotenv**: For environment variable management.

## API Endpoints:

- `POST /agents`: Create a new AI agent.
  - Request Body: `{ type: string, config: AgentConfig }`
  - Response: `{ id: string, type: string }`
- `GET /agents`: Get a list of all active agents.
  - Response: `Array<{ id: string, type: string, state: AgentState, config: AgentConfig }>`
- `GET /agents/:id`: Get details of a specific agent.
  - Response: `{ id: string, type: string, state: AgentState, config: AgentConfig }`
- `POST /agents/:id/interact`: Interact with a specific agent.
  - Request Body: `{ message: string, playerId: string }`
  - Response: `{ response: string }`

## Setup and Running:

1.  **Environment Variables**: Create a `.env` file in the `services/ai-agent` directory.
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    PORT=3003
    ```
    (The `OPENAI_API_KEY` is optional for mock responses during development).

2.  **Install Dependencies**:
    ```bash
    cd services/ai-agent
    npm install
    ```

3.  **Run the service**:
    ```bash
    npm start
    ```
    The service will start on the configured `PORT` (default: 3003).