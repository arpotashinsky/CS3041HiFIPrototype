import React, { useState, useEffect } from 'react';
import './StudentProfileTab.css'; // Import CSS file for styling

function StudentProfileTab() {
  // Define state variables for major, concentration, minor, and year of graduation
  const [major, setMajor] = useState(localStorage.getItem('major') || '');
  const [concentration, setConcentration] = useState(localStorage.getItem('concentration') || '');
  const [minor, setMinor] = useState(localStorage.getItem('minor') || '');
  const [graduationYear, setGraduationYear] = useState(localStorage.getItem('graduationYear') || '2025'); // Set default graduation year to 2025
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data for majors, concentrations, and minors
  const majors = ["Computer Science"];

  const concentrations = {
    "Computer Science": ["None", "Cybersecurity"]
    // Add concentrations for other majors as needed
  };

  const minors = ["Data Science"];

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the submitted data (e.g., save to database)
    console.log("Major:", major);
    console.log("Concentration:", concentration);
    console.log("Minor:", minor);
    console.log("Graduation Year:", graduationYear); // Log the graduation year
    // Store data in local storage
    localStorage.setItem('major', major);
    localStorage.setItem('concentration', concentration);
    localStorage.setItem('minor', minor);
    localStorage.setItem('graduationYear', graduationYear); // Store the graduation year
    // Display success message
    setSuccessMessage('Profile Saved<br /><br />Click on the tabs above to view and edit your customized tracking sheet and 4-year plan');
  };

  useEffect(() => {
    // Retrieve data from local storage on component mount
    setMajor(localStorage.getItem('major') || '');
    setConcentration(localStorage.getItem('concentration') || '');
    setMinor(localStorage.getItem('minor') || '');
    setGraduationYear(localStorage.getItem('graduationYear') || '2025'); // Set default graduation year to 2025
  }, []); // Empty dependency array to run only on component mount

  return (
    <div className="student-profile-container">
      <h2>SELECT YOUR PROGRAM OF STUDY</h2>
      <form className="student-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="major">Major:</label>
          <select id="major" value={major} onChange={(e) => setMajor(e.target.value)}>
            <option value="" disabled>Select Major</option>
            <option value="" disabled>Biomedical Engineering</option>
            <option value="" disabled>Chemical Engineering</option>
            <option value="Computer Science" >Computer Science</option>
            <option value="" disabled>Data Science</option>
            <option value="" disabled>Electrical Engineering</option>
            <option value="" disabled>Environmental Science</option>
            <option value="" disabled>Mathematics</option>
            <option value="" disabled>Mechanical Engineering</option>
            <option value="" disabled>Physics</option>
          </select>
        </div>
        {major && concentrations[major] && (
          <div className="form-group">
            <label htmlFor="concentration">Concentration:</label>
            <select id="concentration" value={concentration} onChange={(e) => setConcentration(e.target.value)}>
              <option value="" disabled>Select Concentration</option>
              {concentrations[major].map((concentration, index) => (
                <option key={index} value={concentration}>{concentration}</option>
              ))}
            </select>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="minor">Minor:</label>
          <select id="minor" value={minor} onChange={(e) => setMinor(e.target.value)}>
            <option value="" disabled>Select Minor</option>
              <option value="" disabled>Biomedical Engineering</option>
              <option value="" disabled>Chemical Engineering</option>
              <option value="Data Science">Data Science</option>
              <option value="" disabled>Electrical Engineering</option>
              <option value="" disabled>Environmental Science</option>
              <option value="" disabled>Mathematics</option>
              <option value="" disabled>Mechanical Engineering</option>
              <option value="" disabled>Physics</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="graduationYear">Graduation Year:</label>
          <select id="graduationYear" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)}>
            <option value="" disabled>Select Year of Graduation</option>
            <option value="" disabled>2024</option>
            <option value="" disabled>2025</option>
            <option value="2026">2026</option> {/* Only option is 2025 */}
            <option value="" disabled>2027</option>
            <option value="" disabled>2028</option>
            <option value="" disabled>2029</option>
          </select>
        </div>
        <button className="submit-button" type="submit">Save</button>
        {successMessage && <p className="success-message">{
<div dangerouslySetInnerHTML={{ __html: successMessage }} />
}</p>}
      </form>
    </div>
  );
}

export default StudentProfileTab;
