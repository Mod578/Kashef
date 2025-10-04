// FIX: Implemented the DemoDashboard component to resolve import errors and provide a dashboard for demo mode.
import React from 'react';
import type { DemoComponent } from '../types';
import Dashboard from './Dashboard';
import DashboardItem from './DashboardItem';
import { useAppContext } from '../context/AppContext';

interface DemoDashboardProps {
    components: DemoComponent[];
}

const DemoDashboard: React.FC<DemoDashboardProps> = ({ components }) => {
    const { state, dispatch } = useAppContext();
    const { selectedComponent } = state;
    
    const handleSelectComponent = (component: DemoComponent) => {
        dispatch({ type: 'SELECT_COMPONENT', payload: component });
    };

    return (
        <Dashboard
            title="مكونات العرض التجريبي"
            subtitle="هذه البيانات مُعدة مسبقًا لأغراض العرض التوضيحي."
        >
            <div className="space-y-2">
                {components.map(comp => (
                    <DashboardItem
                        key={comp.id}
                        component={comp}
                        icon={comp.icon}
                        isSelected={selectedComponent?.id === comp.id}
                        isLoading={false} // No loading in demo mode
                        onSelect={() => handleSelectComponent(comp)}
                    />
                ))}
            </div>
        </Dashboard>
    );
};

export default React.memo(DemoDashboard);