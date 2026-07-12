import React, { useState } from 'react';
import { Users, Video, Car, ChevronDown, ChevronUp } from 'lucide-react';
import './ResourcesPanel.css';

const MOCK_RESOURCES = [
  { id: 1, name: 'Meeting Room A', type: 'room', icon: Users, defaultExpanded: true },
  { id: 2, name: 'Meeting Room B', type: 'room', icon: Users, defaultExpanded: false },
  { id: 3, name: 'Conference Hall', type: 'room', icon: Users, defaultExpanded: false },
  { id: 4, name: 'Projector 1', type: 'equipment', icon: Video, defaultExpanded: false },
  { id: 5, name: 'Projector 2', type: 'equipment', icon: Video, defaultExpanded: false },
  { id: 6, name: 'Company Vehicle 1', type: 'vehicle', icon: Car, defaultExpanded: false },
  { id: 7, name: 'Company Vehicle 2', type: 'vehicle', icon: Car, defaultExpanded: false },
];

const ResourcesPanel = () => {
  const [selectedId, setSelectedId] = useState(1);
  const [expandedIds, setExpandedIds] = useState({ 1: true, 2: true, 3: true }); // Mocking expanded state for rooms

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="resources-panel card">
      <div className="resources-header">
        <h3 className="resources-title">Resources</h3>
      </div>
      <div className="resources-list">
        {MOCK_RESOURCES.map((res) => {
          const Icon = res.icon;
          const isSelected = selectedId === res.id;
          const isExpanded = !!expandedIds[res.id];
          
          return (
            <div 
              key={res.id} 
              className={`resource-item ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedId(res.id)}
            >
              <div className="resource-icon-wrapper">
                <Icon size={18} />
              </div>
              <span className="resource-name">{res.name}</span>
              {res.type === 'room' && (
                <button 
                  className="resource-expand-btn" 
                  onClick={(e) => toggleExpand(res.id, e)}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourcesPanel;
