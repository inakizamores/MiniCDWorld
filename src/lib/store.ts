import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TemplateState {
  // Basic album info
  albumTitle: string;
  artistName: string;
  releaseYear: string;
  
  // Images
  frenteAfuera: string | null;
  frenteDentro: string | null; 
  disco: string | null;
  traseraAfueraLeft: string | null;
  traseraAfueraRight: string | null;
  traseraDentroLeft: string | null;
  traseraDentroRight: string | null;
  
  // Layout options
  numCDsPerPage: number;
  
  // PDF data
  pdfUrl: string | null;
  
  // Actions
  setAlbumInfo: (title: string, artist: string, year: string) => void;
  setImage: (type: string, url: string) => void;
  setNumCDsPerPage: (num: number) => void;
  setPdfUrl: (url: string) => void;
  resetStore: () => void;
}

// Initial state
const initialState = {
  albumTitle: '',
  artistName: '',
  releaseYear: '',
  frenteAfuera: null,
  frenteDentro: null,
  disco: null,
  traseraAfueraLeft: null,
  traseraAfueraRight: null,
  traseraDentroLeft: null,
  traseraDentroRight: null,
  numCDsPerPage: 1,
  pdfUrl: null,
};

// Create the store with persistence
export const useTemplateStore = create<TemplateState>()(
  persist(
    (set) => ({
      ...initialState,

      setAlbumInfo: (title, artist, year) => set({
        albumTitle: title,
        artistName: artist,
        releaseYear: year,
      }),

      setImage: (type, url) => set((state) => ({
        ...state,
        [type]: url,
      })),

      setNumCDsPerPage: (num) => set({
        numCDsPerPage: num,
      }),

      setPdfUrl: (url) => set({
        pdfUrl: url,
      }),

      resetStore: () => set(initialState),
    }),
    {
      name: 'cd-template-storage',
    }
  )
); 