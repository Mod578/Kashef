import { SYSTEM_SLOTS_CONFIG } from '../constants';
import type { SystemSlot } from '../types';
import {
    FaMicrochip, FaGaugeHigh, FaMemory, FaBolt, FaRulerCombined, 
    FaLayerGroup, FaTemperatureHalf, FaHardDrive, FaArrowsLeftRightToLine
} from 'react-icons/fa6';
import React from 'react';

/**
 * Creates a Unicode-safe base64 string from a given string.
 * This is used to generate deterministic and unique IDs from component names.
 * @param str The string to encode.
 * @returns A base64 encoded string.
 */
export const toBase64 = (str: string): string => {
    try {
        // This handles Unicode characters correctly.
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        // Fallback for environments where this might not work, or for simple ASCII.
        return btoa(str);
    }
};

export const getDomainFromUrl = (url: string | undefined): string => {
    if (!url) return '';
    try {
        const hostname = new URL(url).hostname;
        return hostname.replace(/^www\./, '');
    } catch (e) {
        console.error('Invalid URL for domain extraction:', url);
        return '';
    }
};

/**
 * Retrieves component type information (label, icon, etc.) based on the component's type string.
 * @param type The type string of the detected component (e.g., "GPU").
 * @returns The matching system slot configuration object, or null if no match is found.
 */
export const getComponentTypeInfo = (type: string | undefined | null): Omit<SystemSlot, 'detected'> | null => {
    if (!type) return null;
    const lowerType = type.toLowerCase();
    
    const slotConfig = SYSTEM_SLOTS_CONFIG.find(slot => 
        slot.key.toLowerCase() === lowerType
    );
    
    return slotConfig || null;
};

// A mapping of keywords to specific icons for component specifications.
const SPEC_ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    'انوية': FaMicrochip,
    'core': FaMicrochip,
    'المسارات': FaMicrochip,
    'threads': FaMicrochip,
    'سرعة': FaGaugeHigh,
    'clock': FaGaugeHigh,
    'boost': FaGaugeHigh,
    'ذاكرة': FaMemory,
    'memory': FaMemory,
    'vram': FaMemory,
    'ram': FaMemory,
    'gddr': FaMemory,
    'سعة': FaHardDrive,
    'capacity': FaHardDrive,
    'طاقة': FaBolt,
    'power': FaBolt,
    'tdp': FaBolt,
    'واط': FaBolt,
    'واجهة': FaArrowsLeftRightToLine,
    'interface': FaArrowsLeftRightToLine,
    'bus': FaArrowsLeftRightToLine,
    'pcie': FaArrowsLeftRightToLine,
    'حجم': FaRulerCombined,
    'size': FaRulerCombined,
    'form factor': FaRulerCombined,
    'شريحة': FaLayerGroup,
    'chipset': FaLayerGroup,
    'حرارة': FaTemperatureHalf,
    'temp': FaTemperatureHalf,
};

/**
 * Returns an appropriate icon for a given specification label based on keyword matching.
 * This provides a visual cue for different types of technical specs.
 * @param specLabel The label of the specification (e.g., "سرعة المعالج").
 * @returns A React icon component or null if no matching keyword is found.
 */
export const getSpecIcon = (specLabel: string): React.FC<React.SVGProps<SVGSVGElement>> | null => {
    if (!specLabel) return null;
    const lowerLabel = specLabel.toLowerCase();

    for (const keyword in SPEC_ICON_MAP) {
        if (lowerLabel.includes(keyword)) {
            return SPEC_ICON_MAP[keyword];
        }
    }
    return null;
};
