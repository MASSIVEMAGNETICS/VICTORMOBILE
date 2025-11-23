export interface VictorStatus {
  sanctity: number;
  fitness: number;
  mode: string;
  lastEvolution: string;
  clonesFound: number;
  revenueGenerated: number;
  dreamsInterpreted: number;
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'victor';
  timestamp: Date;
}

export interface Threat {
  id: number;
  type: string;
  location: string;
  severity: string;
  status: string;
  description?: string;
  timestamp: Date;
}

export interface Location {
  lat: number;
  lng: number;
  accuracy: number;
}
