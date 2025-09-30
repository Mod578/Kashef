import {
    FaMicrochip, FaGaugeHigh, FaMemory, FaBolt, FaRulerCombined, 
    FaLayerGroup, FaTemperatureHalf, FaHardDrive, FaArrowsLeftRightToLine
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { SYSTEM_SLOTS_CONFIG } from '../constants';
import type { SystemSlot } from '../types';

/**
 * Retrieves the full configuration for a system slot based on a component's type.
 * This is used to get the display name, icon, and other metadata for a given component category.
 *
 * @param {string | undefined | null} type The component type string (e.g., "GPU", "cpu").
 * @returns {Omit<SystemSlot, 'detected'> | null} The corresponding slot configuration or null if not found.
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
// This allows for a visual representation of different technical specs.
const SPEC_ICON_MAP: Record<string, IconType> = {
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
 * This provides a visual cue for different types of technical specs (e.g., a gauge for "speed").
 * The function iterates through a predefined map of keywords and returns the first matching icon.
 *
 * @param {string} specLabel The label of the specification (e.g., "سرعة المعالج").
 * @returns {IconType | null} A React icon component from `react-icons` or null if no match is found.
 */
export const getSpecIcon = (specLabel: string): IconType | null => {
    if (!specLabel) return null;
    const lowerLabel = specLabel.toLowerCase();

    // Find the first keyword in our map that is included in the spec label.
    const matchingKeyword = Object.keys(SPEC_ICON_MAP).find(keyword => lowerLabel.includes(keyword));

    return matchingKeyword ? SPEC_ICON_MAP[matchingKeyword] : null;
};

