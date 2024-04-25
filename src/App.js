import React, { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import StudentProfileTab from './components/StudentProfileTab';
import TrackingSheetTab from './components/TrackingSheetTab';
import FourYearPlannerTab from './components/FourYearPlannerTab';
import { DataProvider } from './components/DataContext'; // Import the data context provider

function App() {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('studentProfile');

  return (
    <div className="App">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Wrap the content with the data context provider */}
      <DataProvider>
        {/* Render content based on the active tab */}
        {activeTab === 'studentProfile' && <StudentProfileTab />}
        {/* Pass the activeTab state to TrackingSheetTab */}
        {activeTab === 'trackingSheet' && <TrackingSheetTab activeTab={activeTab} />}
        {activeTab === 'fourYearPlanner' && <FourYearPlannerTab />}
      </DataProvider>
    </div>
  );
}

export default App;
