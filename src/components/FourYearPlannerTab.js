// FourYearPlannerTab.js

import React, { useState, useEffect } from 'react';
import { useDataContext } from './DataContext';
import './FourYearPlannerTab.css';

function FourYearPlannerTab() {
  const { courseCatalog, studentSchedule, setStudentSchedule } = useDataContext();
  const [selectedRectangle, setSelectedRectangle] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState('A');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [clickedFromCatalog, setClickedFromCatalog] = useState(false);
  const [highlightAdvancedCourses, setHighlightAdvancedCourses] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false); // State to toggle showing/hiding course difficulty
  const [showTooltip, setShowTooltip] = useState(false); // State to toggle showing/hiding tooltip

  // Declare openSections state variable and setOpenSections function
  const [openSections, setOpenSections] = useState({});

  // Function to toggle showing/hiding course difficulty
  const toggleShowDifficulty = () => {
    setShowDifficulty((prevState) => !prevState);
  };

  // Function to handle cell click
  const handleCellClick = (year, term, courseIndex) => {
    console.log("Cell clicked:", year, term, courseIndex);
    const course = groupedSchedule[year][term][courseIndex];
    setSelectedRectangle({ year, term, course });
    setSelectedTerm(term);
  };

  // Function to handle course click
  const handleCourseClick = (courseToChange) => {
    console.log("Clicked course:", courseToChange);
    if (selectedRectangle) {
      const { year, term, course } = selectedRectangle;
      console.log("Cell clicked:", year, term, course);
      let courseChange = false;
      const updatedSchedule = studentSchedule.map((courseItem) => {
        console.log("Course clicked: ", course);
        if (!courseChange && courseItem.year == year && courseItem.term == term && courseItem.courseId == course.courseId) {
          courseChange = true;
          console.log({ year: year, term: term, course: courseToChange.id });
          return { year: parseInt(year), term: term, courseId: courseToChange.id }; // Convert year to an integer
        }
        return courseItem;
      });
      console.log("Updated schedule:", updatedSchedule);
      setStudentSchedule(updatedSchedule);
      setSelectedRectangle(null);
      setSelectedTerm(null);
    }
  };

  // Function to toggle section open/close
  const toggleSection = (department) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [department]: !prevState[department],
    }));
  };

  // Function to toggle highlighting advanced courses
  const toggleHighlightAdvancedCourses = () => {
    setHighlightAdvancedCourses((prevState) => !prevState);
  };

  // Function to render difficulty indicator
  const renderDifficultyIndicator = (difficulty) => {
    let color;
    switch (difficulty) {
      case 'Beginner':
        color = 'green';
        break;
      case 'Intermediate':
        color = 'orange';
        break;
      case 'Advanced':
        color = 'red';
        break;
      default:
        color = 'gray'; // Default color for unknown difficulty
        break;
    }

    return <div className="difficulty-indicator" style={{ backgroundColor: color }}></div>;
  };

  // Function to determine cell class name
  const determineCellClassName = (course, year, term) => {
    if (!course) return '';

    const catalogCourse = courseCatalog.find((c) => c.id === course.courseId);

    if (!catalogCourse) {
      console.error(`Course ${course.courseId} not found in the course catalog.`);
      return '';
    }

    if (!catalogCourse.availableTerms || catalogCourse.availableTerms.length === 0) {
      return '';
    }

    if (!catalogCourse.availableTerms.includes(term)) {
      return 'unavailable-course';
    }

    return '';
  };

  // Declare courseCountMap outside of the renderTermColumn function
  const courseCountMap = {};

  // Function to render term column
  const renderTermColumn = (year, term) => {
    const courses = groupedSchedule[year][term] || [];
    const isYear2TermD = year === '2' && term === 'D';

    // Calculate courseCountMap based on all courses in groupedSchedule
    courses.forEach((course) => {
      if (course) {
        courseCountMap[course.courseId] = (courseCountMap[course.courseId] || 0) + 1;
      }
    });

    const advancedCourseCount = courses.reduce((count, course) => {
      const catalogCourse = courseCatalog.find((c) => c.id === course.courseId);
      return catalogCourse && catalogCourse.difficulty === 'Advanced' ? count + 1 : count;
    }, 0);

    const cellClassName = isYear2TermD ? 'highlighted-term' : highlightAdvancedCourses && advancedCourseCount >= 3 ? 'red-highlight' : '';

    return (
      <td key={`${year}-${term}`} className={cellClassName}>
        <table>
          <tbody>{renderCourseRows(courses, year, term)}</tbody>
        </table>
      </td>
    );
  };

  // Function to render course rows
const renderCourseRows = (courses, year, term) => {
  const maxCourses = 3;
  const numRows = Math.max(maxCourses, courses.length);

  return Array.from({ length: numRows }).map((_, index) => {
    const course = courses[index];
    const cellClassName = determineCellClassName(course, year, term);

    // Update highlightClass logic to check count across all terms
    const highlightClass = course && courseCountMap[course.courseId] > 1 ? 'highlighted-course' : '';
    
    // Add a conditional class to keep the course highlighted
    const isSelectedCourse = selectedRectangle && selectedRectangle.course && selectedRectangle.course.courseId === course.courseId;
    const selectedCourseClass = isSelectedCourse ? 'selected-course' : '';

    return (
      <tr key={index}>
        <td className={`${cellClassName} ${highlightClass} ${selectedCourseClass}`} onClick={() => handleCellClick(year, term, index)}>
          {course ? course.courseId : ''}
        </td>
      </tr>
    );
  });
};

  const terms = ['A', 'B', 'C', 'D'];

  const groupedCatalog = courseCatalog.reduce((acc, course) => {
    const { department } = course;
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(course);
    return acc;
  }, {});

  const groupedSchedule = studentSchedule.reduce((acc, course) => {
    const { year, term } = course;
    if (!acc[year]) {
      acc[year] = {};
    }
    if (!acc[year][term]) {
      acc[year][term] = [];
    }
    acc[year][term].push(course);
    return acc;
  }, {});

  // Function to render terms available for a course
  const renderTermsAvailable = (availableTerms, year, term, courseIndex) => {
    return (
      <span className="term-badge-container">
        {terms.map((term, index) => (
          <span
            key={index}
            className={`term-badge ${availableTerms.includes(term) ? `term-${term.toLowerCase()}` : ''}`}
            onClick={() => availableTerms.includes(term)}
          >
            {term}
          </span>
        ))}
      </span>
    );
  };

  return (
    <div className="four-year-planner">
      <div className="course-catalog">
        <h2>COURSE CATALOG</h2>
        <button className="toggle-button" onClick={toggleShowDifficulty}>SHOW PREDICTED COURSELOAD</button> {/* Button to toggle difficulty */}
        {showDifficulty && ( // Render legend only if showDifficulty is true
         <div className='legend'>
         <div className="legend-container">
          <div className="legend-items">
            <div className="difficulty-indicator" style={{ backgroundColor: 'green', borderColor: 'red' }}></div>
            <div className="legend-text">Low Courseload</div>
            <div className="difficulty-indicator" style={{ backgroundColor: 'orange', borderColor: 'white' }}></div>
            <div className="legend-text">Medium Courseload</div>
            <div className="difficulty-indicator" style={{ backgroundColor: 'red', borderColor: 'white' }}></div>
            <div className="legend-text">High Courseload</div>
          </div>
          </div>
          </div>

        )}
        {Object.entries(groupedCatalog).map(([department, courses]) => (
          <div key={department}>
            <button className="department-button" onClick={() => toggleSection(department)}>
              {department}
            </button>
            {openSections[department] && (
              <ul>
                {courses.map((course) => (
                  <li className="course-option" key={course.id} onClick={() => handleCourseClick(course)}>
                    <div className="difficulty-indicators-container">
                      {showDifficulty && renderDifficultyIndicator(course.difficulty)}
                    </div>
                    <span>
                      <span className="course-name">{course.id + ': ' + course.fullName}</span> {/* Apply class to the course name */}
                      <span className="terms-available">{renderTermsAvailable(course.availableTerms)}</span> {/* Apply class to the terms available */}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        
      </div>
      

      <div className="student-schedule">
        <h2>
          4-YEAR COURSE SCHEDULE PLAN {/* Information icon added here */}
        </h2>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              {terms.map((term) => (
                <th key={term}>{`${term} Term`}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedSchedule).map((year) => (
              <tr key={year}>
                <td>{year}</td>
                {terms.map((term) => renderTermColumn(year, term))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="legend">
          <div className="legend-container">
            <div className="legend-items">
              <div className="legend-square" style={{ backgroundColor: 'white', borderColor: 'blue'}}></div>
              <div className="legend-text">Current Term</div>
              <div className="legend-square" style={{ backgroundColor: '#ffd3d3', borderColor: 'white' }}></div>
              <div className="legend-text">Course in Non-Standard Term</div>
              <div className="legend-square" style={{ backgroundColor: 'grey', borderColor: 'white' }}></div>
              <div className="legend-text">Repeated Courses</div>
            </div>
            </div>
        </div>
        <button className="toggle-button-Advanced" onClick={toggleHighlightAdvancedCourses}>DETECT HIGH-COURSELOADS</button>
      </div>
    </div>
  );
}

export default FourYearPlannerTab;
