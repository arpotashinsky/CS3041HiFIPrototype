import React, { useState } from 'react';
import './FourYearPlannerTab.css'; // Import CSS file for styling

function FourYearPlannerTab() {
  // Sample data for majors and their courses
  const majors = [
    {
      name: 'Computer Science',
      courses: [
        { name: 'CS101', availableTerms: ['A', 'B', 'C', 'D'] },
        { name: 'CS102', availableTerms: ['A'] },
        { name: 'CS201', availableTerms: ['B'] },
        { name: 'CS202', availableTerms: ['D'] }
      ]
    },
    {
      name: 'Mathematics',
      courses: [
        { name: 'MATH101', availableTerms: ['B', 'C', 'D'] },
        { name: 'MATH102', availableTerms: ['B', 'C', 'D'] },
        { name: 'MATH201', availableTerms: ['B', 'C', 'D'] },
        { name: 'MATH202', availableTerms: ['B', 'C', 'D'] }
      ]
    },
    // Add more majors as needed
  ];

  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedRectangle, setSelectedRectangle] = useState(null);
  const [tableData, setTableData] = useState([...Array(16)].map(() => Array(4).fill('')));
  const [selectedTerm, setSelectedTerm] = useState('A'); // Default selected term to 'A'

  const handleSelectRectangle = (rowIndex, colIndex) => {
    setSelectedRectangle({ row: rowIndex, col: colIndex });
    // Determine the term based on the column index
    const term = ['A', 'B', 'C', 'D'][colIndex];
    setSelectedTerm(term);
  };
  

  const handleSelectCourse = (course) => {
    if (selectedRectangle && selectedTerm) {
      const updatedTableData = [...tableData];
      updatedTableData[selectedRectangle.row][selectedRectangle.col] = course;
      setTableData(updatedTableData);
      setSelectedTerm(null); // Reset selected term after selecting a course
    }
  };  

  const isCourseAvailableInTerm = (course, term) => {
    return course.availableTerms.includes(term);
  };  
  
  const handleSelectTerm = (term) => {
    setSelectedTerm(term);
  };
  
  return (
    <div className="four-year-planner">
      <div className="course-list">
        <h2>Courses</h2>
        <ul>
          {majors.map((major, index) => (
            <li key={index}>
              <h3 onClick={() => setSelectedMajor(selectedMajor === major.name ? null : major.name)}>{major.name}</h3>
              {selectedMajor === major.name && (
              <ul>
                {major.courses
                  .filter((course) => isCourseAvailableInTerm(course, selectedTerm)) // Filter courses based on selected term
                  .map((course, idx) => (
                    <li key={idx} onClick={() => handleSelectCourse(course.name)}>{course.name}</li>
                  ))}
              </ul>
            )}
            </li>
          ))}
        </ul>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>A Term</th>
              <th>B Term</th>
              <th>C Term</th>
              <th>D Term</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, yearIndex) => (
              <React.Fragment key={yearIndex}>
                <tr>
                  <td rowSpan="5">Year {yearIndex + 1}</td>
                </tr>
                {Array.from({ length: 4 }).map((_, termIndex) => (
                  <tr key={yearIndex * 4 + termIndex}>
                    {Array.from({ length: 4 }).map((_, courseIndex) => (
                      <td
                      key={courseIndex}
                      className={selectedRectangle && selectedRectangle.row === yearIndex * 4 + termIndex && selectedRectangle.col === courseIndex ? 'selected' : ''}
                      onClick={() => handleSelectRectangle(yearIndex * 4 + termIndex, courseIndex)}
                    >
                      {tableData[yearIndex * 4 + termIndex][courseIndex]}
                    </td>
                  
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FourYearPlannerTab;
