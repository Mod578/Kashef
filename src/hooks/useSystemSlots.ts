import { useMemo } from 'react';
import { SYSTEM_SLOTS_CONFIG } from '../constants';
import type { SystemSlot, DetectedComponent } from '../types';

/**
 * A custom hook that assigns detected components to predefined system slots.
 * It uses a two-stage matching process for each component:
 * 1. **Type-based matching**: It first tries to match the component's `type` field 
 *    (as identified by the AI model) with a slot's `key`.
 * 2. **Keyword-based matching**: If no type match is found, it falls back to searching 
 *    for keywords from the slot's configuration within the component's `name`.
 * 
 * Components that cannot be matched to any slot are returned in a separate array.
 * The entire calculation is memoized with `useMemo` to optimize performance,
 * re-running only when the input `components` array changes.
 *
 * @param {DetectedComponent[]} components An array of components detected by the AI model.
 * @returns {{ slots: SystemSlot[], unassigned: DetectedComponent[] }} An object containing:
 *          - `slots`: An array of system slots, populated with the components they contain.
 *          - `unassigned`: An array of components that could not be matched to any slot.
 */
export const useSystemSlots = (components: DetectedComponent[]): { slots: SystemSlot[], unassigned: DetectedComponent[] } => {
    return useMemo(() => {
        // Initialize slots from configuration and an empty array for unassigned components.
        const slots: SystemSlot[] = SYSTEM_SLOTS_CONFIG.map(config => ({ ...config, detected: [] }));
        const unassigned: DetectedComponent[] = [];
        
        // Create a map for quick slot lookup by key (lowercase for case-insensitivity).
        const slotMap = new Map(slots.map(slot => [slot.key.toLowerCase(), slot]));

        components.forEach(component => {
            let assigned = false;

            // 1. Try to match by component type if it exists
            const componentType = component.type?.toLowerCase();
            if (componentType && slotMap.has(componentType)) {
                slotMap.get(componentType)!.detected.push(component);
                assigned = true;
            }

            // 2. If not matched by type, try to match by keyword
            if (!assigned) {
                const lowerCaseName = component.name.toLowerCase();
                // Find the first slot whose keywords match the component name
                const matchingSlot = slots.find(slot => 
                    slot.keywords.some(kw => lowerCaseName.includes(kw))
                );

                if (matchingSlot) {
                    // Since we are iterating through slots, we need to find the reference in the original `slots` array
                    const originalSlot = slotMap.get(matchingSlot.key.toLowerCase());
                    if(originalSlot) {
                        originalSlot.detected.push(component);
                        assigned = true;
                    }
                }
            }

            // 3. If still not assigned, add to the unassigned list
            if (!assigned) {
                unassigned.push(component);
            }
        });

        return { slots, unassigned };
    }, [components]);
};