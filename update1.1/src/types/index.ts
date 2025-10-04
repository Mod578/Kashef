import type { ElementType } from 'react';

export type Theme = 'light' | 'dark';

export type MobileTab = 'scan' | 'dashboard' | 'details' | 'chat';

export interface Spec {
    label: string;
    value: string;
}

export interface DetectedComponent {
    id: string;
    name: string;
    type: string;
    confidence: number;
    short_summary: string;
    specs: Spec[];
    source: string;
}

export interface VideoPlayerRef {
    getFrameData: () => { data: string; mimeType: string } | null;
    reset: () => void;
    resume: () => void;
}

export interface SystemSlot {
    key: string;
    label: string;
    icon: ElementType;
    keywords: string[];
    detected: DetectedComponent[];
}

export interface GroundingChunk {
    web?: {
        uri?: string;
        title?: string;
    }
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    content: string;
    sources?: GroundingChunk[];
}

// FIX: Add missing types for Demo Mode and Scan History to resolve import errors.
export type UseCase = 'coffee' | 'medical' | 'drone';

export interface DemoComponent extends DetectedComponent {
    icon: ElementType;
}

export interface DemoData {
    title: string;
    imageUrl: string;
    detectedComponents: DemoComponent[];
    chatHistory: ChatMessage[];
}

export interface Scan {
    id: string;
    name: string;
    timestamp: number;
    components: DetectedComponent[];
}
