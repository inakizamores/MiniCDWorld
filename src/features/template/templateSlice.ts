import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

// Define types for our template state
export interface ImageSection {
  originalFile: File | null;
  croppedImage: string | null;
  width: number;
  height: number;
}

export interface TemplateState {
  albumTitle: string;
  artistName: string;
  cdsPerPage: number;
  images: {
    frenteAfuera: ImageSection | null;
    frenteDentro: ImageSection | null;
    disco: ImageSection | null;
    traseraAfuera: {
      main: ImageSection | null;
      side: ImageSection | null;
    };
    traseraDentro: {
      main: ImageSection | null;
      side: ImageSection | null;
    };
  };
  step: number;
}

const initialState: TemplateState = {
  albumTitle: '',
  artistName: '',
  cdsPerPage: 1,
  images: {
    frenteAfuera: null,
    frenteDentro: null,
    disco: null,
    traseraAfuera: {
      main: null,
      side: null,
    },
    traseraDentro: {
      main: null,
      side: null,
    },
  },
  step: 1,
}

export const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setAlbumTitle: (state, action: PayloadAction<string>) => {
      state.albumTitle = action.payload
    },
    setArtistName: (state, action: PayloadAction<string>) => {
      state.artistName = action.payload
    },
    setCdsPerPage: (state, action: PayloadAction<number>) => {
      state.cdsPerPage = action.payload > 2 ? 2 : action.payload
    },
    setFrenteAfuera: (state, action: PayloadAction<ImageSection>) => {
      state.images.frenteAfuera = action.payload
    },
    setFrenteDentro: (state, action: PayloadAction<ImageSection>) => {
      state.images.frenteDentro = action.payload
    },
    setDisco: (state, action: PayloadAction<ImageSection>) => {
      state.images.disco = action.payload
    },
    setTraseraAfueraMain: (state, action: PayloadAction<ImageSection>) => {
      state.images.traseraAfuera.main = action.payload
    },
    setTraseraAfueraSide: (state, action: PayloadAction<ImageSection>) => {
      state.images.traseraAfuera.side = action.payload
    },
    setTraseraDentroMain: (state, action: PayloadAction<ImageSection>) => {
      state.images.traseraDentro.main = action.payload
    },
    setTraseraDentroSide: (state, action: PayloadAction<ImageSection>) => {
      state.images.traseraDentro.side = action.payload
    },
    nextStep: (state) => {
      state.step += 1
    },
    prevStep: (state) => {
      state.step = Math.max(1, state.step - 1)
    },
    resetTemplate: () => initialState,
  },
})

export const {
  setAlbumTitle,
  setArtistName,
  setCdsPerPage,
  setFrenteAfuera,
  setFrenteDentro,
  setDisco,
  setTraseraAfueraMain,
  setTraseraAfueraSide,
  setTraseraDentroMain,
  setTraseraDentroSide,
  nextStep,
  prevStep,
  resetTemplate,
} = templateSlice.actions

// Selectors
export const selectTemplateState = (state: RootState) => state.template

export default templateSlice.reducer 