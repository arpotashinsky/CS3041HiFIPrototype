// Tabs.js
import React from 'react';
import './Tabs.css'; // Import CSS file for styling

function Tabs({ activeTab, setActiveTab }) {
  return (
    <div className="tabs">
      <button onClick={() => setActiveTab('studentProfile')} className={activeTab === 'studentProfile' ? 'active' : ''}>Student Profile</button>
      <button onClick={() => setActiveTab('trackingSheet')} className={activeTab === 'trackingSheet' ? 'active' : ''}>Tracking Sheet</button>
      <button onClick={() => setActiveTab('fourYearPlanner')} className={activeTab === 'fourYearPlanner' ? 'active' : ''}>Four-Year Planner</button>
    </div>
  );
}

export default Tabs;
