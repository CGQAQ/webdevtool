import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const TABSLICE_NAME = "tabs";

export type Tabs = Array<Tab>

const TITLE_DEFAULT = 'New Tab';
const DATA_DEFAULT: TabData = Object.freeze({
    addr: '',
    port: 0,
    protocol: 'http',
    isClient: true
});

export interface Tab {
    id: number,
    title: string,
    data: TabData
}

export interface TabData {
    addr: string,
    port: number,
    protocol: string,
    isClient: boolean,
}

function generateTab(): Tab {
    return {
        id: Date.now(),
        title: TITLE_DEFAULT,
        data: DATA_DEFAULT,
    }
}

const tabSlice = createSlice({
    name: TABSLICE_NAME,
    extraReducers: undefined,
    initialState: [{
        id: Date.now(),
        title: TITLE_DEFAULT,
        data: DATA_DEFAULT,
    }] as Tabs,
    reducers: {
        new(state) {
            state.push(generateTab());
        },
        remove(state, action: PayloadAction<number>) {
          return state.filter(it => it.id !== action.payload);
        },
        rename(state, action: PayloadAction<{id: number, title: string}>) {
          const tab = state.find(it => it.id === action.payload.id);
          if(tab && tab.title)
            tab.title = action.payload.title;
        }
    },
});

export default tabSlice;