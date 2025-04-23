import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const reducers = combineReducers({
    emptyState: (state = {}) => state
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: []
};

const persistedReducer = persistReducer(persistConfig, reducers);

const action = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof action.getState>

export type AppDispatch = typeof action.dispatch

export const useActionDispatch = () => useDispatch<AppDispatch>()
export const useActionSelector: TypedUseSelectorHook<RootState> = useSelector

export default action