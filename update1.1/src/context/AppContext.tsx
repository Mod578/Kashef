import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
// FIX: Import missing types for Demo Mode and Scan History.
import type { Theme, DetectedComponent, UseCase, Scan } from '../types';
// FIX: Import demo data to be used in the reducer.
import { DEMO_DATA } from '../data/demoData';


// 1. STATE INTERFACE
interface AppState {
    theme: Theme;
    detectedComponents: DetectedComponent[];
    selectedComponent: DetectedComponent | null;
    isProcessingFrame: boolean;
    scanStateKey: number; // Used to force re-mounting of the video player
    
    // State for image generation
    generatedImageUrl: string | null;
    isLoadingImage: boolean;
    imageCache: { [componentId: string]: string };
    imageGenerationErrors: { [componentId: string]: boolean };

    // FIX: Add state for Demo Mode
    isDemoMode: boolean;
    demoUseCase: UseCase | null;

    // FIX: Add state for Scan History
    scanHistory: Scan[];
}

// 2. ACTION TYPES
type AppAction =
    | { type: 'SET_THEME'; payload: Theme }
    | { type: 'ADD_DETECTED_COMPONENTS'; payload: DetectedComponent[] }
    | { type: 'SELECT_COMPONENT'; payload: DetectedComponent | null }
    | { type: 'SET_IS_PROCESSING_FRAME'; payload: boolean }
    | { type: 'RESET_DETECTION' }
    // Actions for image generation
    | { type: 'SET_GENERATED_IMAGE_URL', payload: string | null }
    | { type: 'SET_IS_LOADING_IMAGE', payload: boolean }
    | { type: 'CACHE_IMAGE', payload: { componentId: string; imageUrl: string } }
    | { type: 'MARK_IMAGE_GENERATION_FAILED', payload: string }
    // FIX: Add actions for Demo Mode
    | { type: 'START_DEMO_MODE', payload: UseCase }
    | { type: 'EXIT_DEMO_MODE' }
    // FIX: Add actions for Scan History
    | { type: 'LOAD_SCAN', payload: Scan }
    | { type: 'DELETE_SCAN', payload: string };

// 3. INITIAL STATE
const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('app-theme');
        if (storedTheme === 'light' || storedTheme === 'dark') {
            return storedTheme;
        }
    }
    return 'dark';
};

// FIX: Add function to load scan history from localStorage.
const getInitialScanHistory = (): Scan[] => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedHistory = window.localStorage.getItem('scan-history');
        if (storedHistory) {
            try {
                // A simple validation to ensure it's an array.
                const parsed = JSON.parse(storedHistory);
                return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
                return [];
            }
        }
    }
    return [];
};


const initialState: AppState = {
    theme: getInitialTheme(),
    detectedComponents: [],
    selectedComponent: null,
    isProcessingFrame: false,
    scanStateKey: 0,
    generatedImageUrl: null,
    isLoadingImage: false,
    imageCache: {},
    imageGenerationErrors: {},
    // FIX: Initialize new state properties.
    isDemoMode: false,
    demoUseCase: null,
    scanHistory: getInitialScanHistory(),
};

// 4. REDUCER
const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        
        case 'ADD_DETECTED_COMPONENTS': {
            const newComponents = action.payload.filter(
                (newComp) => !state.detectedComponents.some((existing) => existing.id === newComp.id)
            );
            return {
                ...state,
                detectedComponents: [...state.detectedComponents, ...newComponents],
            };
        }

        case 'SELECT_COMPONENT':
            return { 
                ...state, 
                selectedComponent: action.payload,
                // Reset image state when component changes
                generatedImageUrl: action.payload ? state.imageCache[action.payload.id] || null : null,
                isLoadingImage: false,
            };

        case 'SET_IS_PROCESSING_FRAME':
            return { ...state, isProcessingFrame: action.payload };
        
        case 'RESET_DETECTION':
            return {
                ...state,
                detectedComponents: [],
                selectedComponent: null,
                scanStateKey: state.scanStateKey + 1,
            };
        
        case 'SET_GENERATED_IMAGE_URL':
            return { ...state, generatedImageUrl: action.payload };
            
        case 'SET_IS_LOADING_IMAGE':
            return { ...state, isLoadingImage: action.payload };

        case 'CACHE_IMAGE':
            return {
                ...state,
                imageCache: {
                    ...state.imageCache,
                    [action.payload.componentId]: action.payload.imageUrl,
                },
            };
        
        case 'MARK_IMAGE_GENERATION_FAILED':
            return {
                ...state,
                imageGenerationErrors: {
                    ...state.imageGenerationErrors,
                    [action.payload]: true,
                },
            };
        
        // FIX: Implement reducer logic for Demo Mode actions.
        case 'START_DEMO_MODE': {
            const demoData = DEMO_DATA[action.payload];
            if (!demoData) return state;
            return {
                ...initialState,
                theme: state.theme,
                scanHistory: state.scanHistory,
                isDemoMode: true,
                demoUseCase: action.payload,
                detectedComponents: demoData.detectedComponents,
            };
        }

        case 'EXIT_DEMO_MODE':
            return {
                ...initialState,
                theme: state.theme,
                scanHistory: state.scanHistory,
                isDemoMode: false,
                demoUseCase: null,
            };
        
        // FIX: Implement reducer logic for Scan History actions.
        case 'LOAD_SCAN':
            return {
                ...state,
                detectedComponents: action.payload.components,
                selectedComponent: null,
                scanStateKey: state.scanStateKey + 1,
                isDemoMode: false,
                demoUseCase: null,
            };

        case 'DELETE_SCAN':
            return {
                ...state,
                scanHistory: state.scanHistory.filter(scan => scan.id !== action.payload),
            };


        default:
            return state;
    }
};

// 5. CREATE CONTEXT
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 6. PROVIDER COMPONENT
interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('app-theme', state.theme);
            // FIX: Persist scan history to localStorage.
            window.localStorage.setItem('scan-history', JSON.stringify(state.scanHistory));
        }
    }, [state.theme, state.scanHistory]);


    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

// 7. CUSTOM HOOK
export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
