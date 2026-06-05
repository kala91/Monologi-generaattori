
export enum MessageRole {
  DIRECTOR = 'director',
  PLAYER = 'player',
  SYSTEM = 'system'
}

export interface GameState {
  characters: string[];
  locations: string[];
  items: string[];
  currentDramaAnalysis: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  mechanic?: string;
  dynamic?: string;
  timestamp: number;
}

export interface GameStep {
  mechanic: string;
  dynamic: string;
  content: string;
  worldState: GameState;
  dramaAnalysis: string;
}

export interface SetupResponse {
  worldDescription: string;
  characterProfile: string;
  initialSituation: string;
  initialState: GameState;
}
