import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const TABSLICE_NAME = "tabs";

export type Tabs = Array<Tab>

const TITLE_DEFAULT = "New Tab";


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

function defaultData() {
  return {
    addr: "",
    port: 0,
    protocol: "http",
    isClient: true,
  };
}

function generateTab(): Tab {
  return {
    id: Date.now(),
    title: TITLE_DEFAULT,
    data: defaultData(),
  };
}

interface InitialStateType {
  tabs: Tabs,
  current: number,
}

function initialState(): InitialStateType {
  const now = Date.now();
  return {
    tabs: [{
      id: now,
      title: TITLE_DEFAULT,
      data: defaultData(),
    }] as Tabs, current: now,
  };
}

const tabSlice = createSlice({
  name: TABSLICE_NAME,
  extraReducers: undefined,
  initialState: initialState(),
  reducers: {
    new(state) {
      const newTab = generateTab();
      state.tabs.push(newTab);
      state.current = newTab.id;
    },
    remove(state, action: PayloadAction<number>) {
      return { tabs: state.tabs.filter(it => it.id !== action.payload), current: state.current };
    },
    rename(state, action: PayloadAction<{ id: number, title: string }>) {
      const tab = state.tabs.find(it => it.id === action.payload.id);
      if (tab && tab.title)
        tab.title = action.payload.title;
    },
    changeCurrent(state, action: PayloadAction<number>) {
      state.current = action.payload;
    },
  },
});

export default tabSlice;