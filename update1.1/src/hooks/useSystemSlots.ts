import { useMemo } from 'react';
import { SYSTEM_SLOTS_CONFIG } from '../constants';
import type { SystemSlot, DetectedComponent } from '../types';

/**
 * A custom hook to assign detected components to predefined system slots.
 * The assignment logic is more robust now, prioritizing the `type` field returned by the model.
 * 
 * @param components An array of components detected by the Gemini model.
 * @returns An object containing `slots` (predefined slots with their matched components) and `unassigned` components.
 */
export const useSystemSlots = (components: DetectedComponent[]): { slots: SystemSlot[], unassigned: DetectedComponent[] } => {
    return useMemo(() => {
        const slots: SystemSlot[] = SYSTEM_SLOTS_CONFIG.map(config => ({ ...config, detected: [] }));
        const unassigned: DetectedComponent[] = [];
        const assignedIds = new Set<string>();

        // First pass: Assign based on the `type` field from the model.
        components.forEach(component => {
            const lowerCaseType = component.type?.toLowerCase();
            const matchingSlot = slots.find(slot => slot.key.toLowerCase() === lowerCaseType);
            
            if (matchingSlot) {
                // To avoid duplicates, check if it's already assigned
                if (!assignedIds.has(component.id)) {
                    matchingSlot.detected.push(component);
                    assignedIds.add(component.id);
                }
            }
        });

        // Second pass: For any component not matched by type, try keyword matching.
        components.forEach(component => {
            if (assignedIds.has(component.id)) {
                return; // Already assigned
            }

            const lowerLabel = component.name.toLowerCase();
            const matchingSlot = slots.find(slot => 
                slot.keywords.some(kw => lowerLabel.includes(kw))
            );

            if (matchingSlot) {
                matchingSlot.detected.push(component);
                assignedIds.add(component.id);
            } else {
                unassigned.push(component);
            }
        });

        return { slots, unassigned };
    }, [components]);
};