import React from 'react';
import type { DemoComponent } from '../types';
import Dashboard from './Dashboard';
import DashboardItem from './DashboardItem';
import { useAppContext } from '../context/AppContext';

interface DemoDashboardProps {
    /** An array of pre-configured demo components to be displayed. */
    components: DemoComponent[];
}

/**
 * A dashboard panel specifically for displaying a list of demo components.
 * It uses the generic `Dashboard` and `DashboardItem` components to create a consistent UI.
 * This component is only active when the application is in "demo mode".
 *
 * @param {DemoDashboardProps} props The props for the component.
 * @returns {React.ReactElement} The rendered demo dashboard.
 */
const DemoDashboard: React.FC<DemoDashboardProps> = ({ components }) => {
    const { state, dispatch } = useAppContext();
    const { selectedComponent } = state;
    
    const handleSelectComponent = (component: DemoComponent) => {
        dispatch({ type: 'SELECT_COMPONENT', payload: component });
    };

    return (
        <Dashboard
            title="مكونات العرض التجريبي"
            subtitle="هذه البيانات مُعدة مسبقًا لأغراض العرض."
        >
            <div className="space-y-2">
                {components.map(comp => (
                    <DashboardItem
                        key={comp.id}
                        component={comp}
                        icon={comp.icon}
                        isSelected={selectedComponent?.id === comp.id}
                        isLoading={false} // No loading state in demo mode
                        onSelect={handleSelectComponent}
                    />
                ))}
            </div>
        </Dashboard>
    );
};

export default React.memo(DemoDashboard);
