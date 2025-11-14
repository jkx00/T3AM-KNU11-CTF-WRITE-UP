
export type WriteupCategory = 'Web' | 'Crypto' | 'Pwn' | 'Reverse Engineering' | 'Forensics' | 'Misc' | 'OSINT' | 'Steganography' | 'Mobile' | 'Blockchain';
export type WriteupDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Insane';

export interface Attachment {
  data: string; // base64 encoded string
  mimeType: string;
  name: string;
}

export interface Writeup {
  id: number;
  title: string;
  category: WriteupCategory;
  difficulty: WriteupDifficulty;
  description: string;
  solution: string;
  flag: string;
  author: string;
  attachment?: Attachment | null;
}
