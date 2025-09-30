import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Theme, DetectedComponent, DemoComponent, UseCase, Scan } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { DEMO_DATA } from '../data/demoData';

// 1. STATE AND ACTION TYPES
// ===============================================
interface AppState {
    theme: Theme;
    isProcessingFrame: boolean;
    isLoadingImage: boolean;
    detectedComponents: DetectedComponent[];
    selectedComponent: DetectedComponent | DemoComponent | null;
    generatedImageUrl: string | null;
    scanStateKey: number; // Used to reset VideoPlayer
    // Demo Mode
    isDemoMode: boolean;
    demoUseCase: UseCase | null;
    // Scan History
    scanHistory: Scan[];
}

type Action =
    | { type: 'SET_THEME'; payload: Theme }
    | { type: 'SET_IS_PROCESSING_FRAME'; payload: boolean }
    | { type: 'SET_IS_LOADING_IMAGE'; payload: boolean }
    | { type: 'ADD_DETECTED_COMPONENTS'; payload: DetectedComponent[] }
    | { type: 'SELECT_COMPONENT'; payload: DetectedComponent | DemoComponent | null }
    | { type: 'SET_GENERATED_IMAGE_URL'; payload: string | null }
    | { type: 'RESET_SCAN' }
    | { type: 'RESET_VIEW' }
    // Demo Mode Actions
    | { type: 'START_DEMO_MODE'; payload: UseCase }
    | { type: 'EXIT_DEMO_MODE' }
    // Scan History Actions
    | { type: 'SAVE_SCAN'; payload: string }
    | { type: 'LOAD_SCAN'; payload: Scan }
    | { type: 'DELETE_SCAN'; payload: string }
    | { type: 'SET_SCAN_HISTORY'; payload: Scan[] };


// 2. INITIAL STATE
// ===============================================
const initialState: AppState = {
    theme: 'dark', // This will be overridden by useLocalStorage
    isProcessingFrame: false,
    isLoadingImage: false,
    detectedComponents: [],
    selectedComponent: null,
    generatedImageUrl: null,
    scanStateKey: 0,
    isDemoMode: false,
    demoUseCase: null,
    scanHistory: [],
};


// 3. REDUCER FUNCTION
// ===============================================
const appReducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'SET_IS_PROCESSING_FRAME':
            return { ...state, isProcessingFrame: action.payload };
        case 'SET_IS_LOADING_IMAGE':
            return { ...state, isLoadingImage: action.payload };
        case 'ADD_DETECTED_COMPONENTS':
            return { ...state, detectedComponents: [...state.detectedComponents, ...action.payload] };
        case 'SELECT_COMPONENT':
            return { ...state, selectedComponent: action.payload };
        case 'SET_GENERATED_IMAGE_URL':
            return { ...state, generatedImageUrl: action.payload };
        case 'RESET_SCAN':
            return {
                ...state,
                detectedComponents: [],
                selectedComponent: null,
                generatedImageUrl: null,
                scanStateKey: state.scanStateKey + 1,
            };
        case 'RESET_VIEW':
             return {
                ...state,
                selectedComponent: null,
                generatedImageUrl: null,
                scanStateKey: state.scanStateKey + 1,
            };
        case 'START_DEMO_MODE':
            const demoData = DEMO_DATA[action.payload];
            return {
                ...state,
                isDemoMode: true,
                demoUseCase: action.payload,
                detectedComponents: [],
                selectedComponent: demoData.detectedComponents[0] || null,
            };
        case 'EXIT_DEMO_MODE':
            return {
                ...initialState,
                theme: state.theme, // Persist theme
                scanHistory: state.scanHistory, // Persist history
            };
        case 'SAVE_SCAN':
            const newScan: Scan = {
                id: `scan-${Date.now()}`,
                name: action.payload,
                timestamp: Date.now(),
                components: state.detectedComponents,
            };
            return { ...state, scanHistory: [newScan, ...state.scanHistory] };
        case 'LOAD_SCAN':
            return {
                ...state,
                isDemoMode: false,
                demoUseCase: null,
                detectedComponents: action.payload.components,
                selectedComponent: null,
                generatedImageUrl: null,
                scanStateKey: state.scanStateKey + 1,
            };
        case 'DELETE_SCAN':
            return {
                ...state,
                scanHistory: state.scanHistory.filter(scan => scan.id !== action.payload),
            };
        case 'SET_SCAN_HISTORY':
            return { ...state, scanHistory: action.payload };
        default:
            return state;
    }
};


// 4. CONTEXT DEFINITION
// ===============================================
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


// 5. PROVIDER COMPONENT
// ===============================================
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Persist theme and scan history using localStorage
    const [savedTheme, setSavedTheme] = useLocalStorage<Theme>('theme', 'dark');
    const [savedHistory, setSavedHistory] = useLocalStorage<Scan[]>('scanHistory', []);
    
    const [state, dispatch] = useReducer(appReducer, {
        ...initialState,
        theme: savedTheme,
        scanHistory: savedHistory,
    });

    // Effect to sync state changes back to localStorage
    useEffect(() => {
        setSavedTheme(state.theme);
    }, [state.theme, setSavedTheme]);

    useEffect(() => {
        setSavedHistory(state.scanHistory);
    }, [state.scanHistory, setSavedHistory]);


    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};


// 6. CUSTOM HOOK
// ===============================================
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
