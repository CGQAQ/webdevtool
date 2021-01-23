import { createSlice } from '@reduxjs/toolkit';

const Tab = 'tab';


const tabSlice = createSlice({
    extraReducers: undefined,
    reducers: {},
    name: Tab,
    initialState: ['new tab']
});

export default tabSlice;