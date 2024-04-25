import React, { useState, useEffect } from 'react';
import { useDataContext } from './DataContext';
import './TrackingSheetTab.css'; // Import the CSS file

const TrackingSheetTab = () => {
  // Fetch necessary data from DataContext
  const { studentSchedule, setStudentSchedule, courseCatalog } = useDataContext();
  const [showWarning, setShowWarning] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // State to track mouse position
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [degreeRequirementsMajor] = useState([
    { name: 'Basic Science', numCourses: 5, departments: ['Physics', 'Chemistry', 'Biology', 'Biomedical Engineering'], message: "Satisfied with 5 BB, PH, CH, or BME classes" },
    { name: 'Social Science', numCourses: 2, departments: ['Environment', 'Business'], message: "Satisfied with 2 ENV or BUS classes" },
    { name: 'Humanities', numCourses: 6, departments: ['Humanities'], message: "Satisfied with 6 WR classes" },
    { name: 'Mathematics', numCourses: 7, departments: ['Mathematics'], message: "Satisfied with 7 MA classes" },
    { name: 'Computer Science', numCourses: 18, departments: ['Computer Science'], message: "Satisfied with 18 CS classes" },
  ]);

  const [degreeRequirementsMinor] = useState([
    { name: 'Business', numCourses: 2, departments: ['Business'] , message: "Satisfied with 2 BUS classes"},
    { name: 'Mathematics', numCourses: 2, departments: ['Mathematics'] , message: "Satisfied with 2 MA classes"},
    { name: 'Computer Science', numCourses: 2, departments: ['Computer Science'] , message: "Satisfied with 2 CS classes"},
  ]);

  const [activeRequirementType, setActiveRequirementType] = useState('major');
  const [requirementTableName, setRequirementTableName] = useState('SELECT A COURSE TO CHANGE →→→'); // New state for requirement table name

  // Function to get full course name from courseCatalog
  const getCourseFullName = (courseId) => {
    const course = courseCatalog.find((course) => course.id === courseId);
    return course ? course.fullName : '';
  };

  const isBeforeYear3TermD = (courseId) => {
    const courseInSchedule = studentSchedule.find(course => course.courseId === courseId);
    if (!courseInSchedule) {
        // Handle invalid course ID
        return false;
    }
    
    // Extract year and term from the course in studentSchedule
    const { year, term } = courseInSchedule;

    // Check if the year is before year 2 or if it's year 2 but the term is before 'D'
    return year < 2 || (year == 2 && term < 'D');
};

  
const handleMouseMove = (event) => {
  // Update mouse position state
  setMousePosition({ x: event.clientX, y: event.clientY });

  // Set CSS variables for mouse position
  document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
};


useEffect(() => {
  // Add event listener for mouse move
  document.addEventListener('mousemove', handleMouseMove);

  // Remove event listener when component unmounts
  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
  };
}, []);

  // Function to group courses by requirement
  const groupCoursesByRequirement = (majorRequirements, minorRequirements) => {
    const coursesByRequirement = {};
    [...majorRequirements || [], ...minorRequirements || []].forEach(({ name, numCourses }) => {
      coursesByRequirement[name] = Array(numCourses).fill(null);
    });

  const uniqueStudentSchedule = Array.from(new Set(studentSchedule.map(item => item.courseId)));

  uniqueStudentSchedule.forEach((courseId) => {
    const course = courseCatalog.find((course) => course.id === courseId);
    if (!course) return; // Ignore invalid courses

    // Find the requirement that the course fulfills
    const requirement = [...majorRequirements, ...minorRequirements].find((req) => req.departments.includes(course.department));

    if (requirement) {
      if (!coursesByRequirement[requirement.name]) {
        coursesByRequirement[requirement.name] = [];
      }
      const emptySpotIndex = coursesByRequirement[requirement.name].findIndex((spot) => spot === null);
      if (emptySpotIndex !== -1) {
        coursesByRequirement[requirement.name][emptySpotIndex] = course; // Fill empty spot with course object
      }
    }
  });
  return coursesByRequirement;
};


  // State for courses grouped by requirement
  const [coursesByRequirement, setCoursesByRequirement] = useState({});

  useEffect(() => {
    const requirements = activeRequirementType === 'major' ? degreeRequirementsMajor : degreeRequirementsMinor;
    const groupedCourses = groupCoursesByRequirement(requirements, []);
    setCoursesByRequirement(groupedCourses);
  }, [studentSchedule, courseCatalog, degreeRequirementsMajor, degreeRequirementsMinor, activeRequirementType]);
  
  // Function to filter courses by department based on clicked course
  const filterCoursesByDepartment = (clickedCourse) => {
    const scheduledCourseIds = new Set(studentSchedule.map(scheduleItem => scheduleItem.courseId));

    const requirements = activeRequirementType === 'major' ? degreeRequirementsMajor : degreeRequirementsMinor;
    const relevantDepartments = requirements
      .filter(requirement => requirement.departments.includes(clickedCourse.department))
      .flatMap(requirement => requirement.departments);

    return courseCatalog.filter((course) => {
      return relevantDepartments.includes(course.department) && !scheduledCourseIds.has(course.id);
    });
  };

  // State for managing the filtered courses
  const [filteredCourses, setFilteredCourses] = useState([]);

  // State to store the clicked course in the requirement table
  const [clickedCourse, setClickedCourse] = useState(null);

  useEffect(() => {
    if (clickedCourse) {
      const courses = filterCoursesByDepartment(clickedCourse);
      setFilteredCourses(courses);
    }
  }, [clickedCourse, courseCatalog, studentSchedule, activeRequirementType]);

  // Function to handle click on a course in the requirement table
  const handleCourseClick = (course, requirementName) => {
    if (!course) {
      alert("Error: Missing courses that fulfill requirement \nTo fix: Add a course to your four year plan"); // Warning message for undefined course
      return; // Exit the function
    }
    if (isBeforeYear3TermD(course.id)) {
      alert('This course is completed and cannot be changed'); // Show warning if needed
    } else {
      setClickedCourse(course);
      setSelectedCourse(course);
      console.log(requirementName)
      setRequirementTableName(`ALTERNATIVE COURSES FULFILLING <u>${requirementName.toUpperCase()}</u> REQUIREMENT`); // Set requirement table name
      const filteredCourses = filterCoursesByDepartment(course);
      setFilteredCourses(filteredCourses);
    }
  };
  

  // Handle click on a course in the course catalog to replace the selected course in the requirement table
  const handleCatalogCourseClick = (newCourse) => {
    if (clickedCourse) {
      replaceCourse(clickedCourse, newCourse);
      setClickedCourse(null); // Reset clicked course after handling click
    }
  };

  // Replace the selected course in the requirement table with the clicked course from the catalog
  const replaceCourse = (oldCourse, newCourse) => {
    const updatedStudentSchedule = studentSchedule.map((scheduleItem) => {
      if (scheduleItem.courseId === oldCourse.id) {
        scheduleItem.courseId = newCourse.id;
      }
    });

    const updatedCoursesByRequirement = { ...coursesByRequirement };
    Object.keys(updatedCoursesByRequirement).forEach((requirement) => {
      updatedCoursesByRequirement[requirement] = updatedCoursesByRequirement[requirement].map((course) =>
        course === oldCourse ? newCourse : course
      );
    });
    setCoursesByRequirement(updatedCoursesByRequirement);
  };

  const renderTables = () => {
    const allRequirements = Object.keys(coursesByRequirement);
    const numColumns = 3;
    const numRows = Math.ceil(allRequirements.length / numColumns);
    const tables = [];
  
    const requirementsPerColumn = Math.ceil(allRequirements.length / numColumns);
  
    for (let i = 0; i < numColumns; i++) {
      const columnTables = [];
      const start = i * requirementsPerColumn;
      const end = Math.min(start + requirementsPerColumn, allRequirements.length);
  
      for (let j = start; j < end; j++) {
        const requirement = allRequirements[j];
        const requirementObj = activeRequirementType === 'major' ? degreeRequirementsMajor.find(req => req.name === requirement) : degreeRequirementsMinor.find(req => req.name === requirement);
        columnTables.push(
          <div key={requirement} className="requirement-table">
            <h3 
              data-message={requirementObj?.message} // Set data-message attribute
              onMouseOver={(event) => {
                const message = event.target.getAttribute('data-message');
                const messageContainer = document.getElementById('messageContainer');
                if (message && messageContainer) {
                  messageContainer.textContent = message;
                  messageContainer.style.display = 'block'; // Show the message container
                }
              }}
              onMouseOut={() => {
                const messageContainer = document.getElementById('messageContainer');
                if (messageContainer) {
                  messageContainer.style.display = 'none'; // Hide the message container when mouse leaves
                }
              }}
            >
              {requirement}
            </h3>
            <table>
              <tbody>
              {coursesByRequirement[requirement]?.map((course, index) => (
                <tr
                  key={`${requirement}-${index}`}
                  className={`
                    ${course && isBeforeYear3TermD(course.id) ? 'completed-course' : 'regular-course'}
                    ${selectedCourse && course && selectedCourse.id === course.id ? 'selected-course' : ''}` // Add selected-course class conditionally
                  }
                  {...console.log('course')}
                  onClick={() => handleCourseClick(course, requirement)} // Remove 'requirement' argument
                >
                  <td className="course-cell">
                    {/* Check if the course is present in both major and minor requirements */}
                    {course && isCourseInBothRequirements(course) && (
                      <div className="dot"></div>
                    )}
                    {course ? `${course.id}` : ''}
                    {course && <div className="tooltip">{getCourseFullName(course.id)}</div>}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        );
      }
  
      tables.push(
        <div key={i} style={{ flex: 1 }}>
          {columnTables}
        </div>
      );
    }
  
    return <div style={{ display: 'flex' }}>{tables}</div>;
  };


// Render the filtered courses in the course catalog
const renderFilteredCourses = () => {
  // Group courses by department
  const coursesByDepartment = {};

  filteredCourses.forEach(course => {
    if (!coursesByDepartment[course.department]) {
      coursesByDepartment[course.department] = [];
    }
    coursesByDepartment[course.department].push(course);
  });

  // Render courses grouped by department
  return Object.entries(coursesByDepartment).map(([department, courses]) => (
    <div key={department}>
      <h3>{department}</h3>
      <ul>
        {courses.map(course => (
          <li key={course.id} onClick={() => handleCatalogCourseClick(course)}>
            {`${course.id}: ${course.fullName}`}
          </li>
        ))}
      </ul>
    </div>
  ));
};


let greenDotCount = 0; // Counter to track the number of green dots displayed

const isCourseInBothRequirements = (course) => {
  if (!course || !course.department) {
    return false; // Return false if course is undefined or does not have a department property
  }
  const majorDepartments = degreeRequirementsMajor.flatMap(req => req.departments);
  const minorDepartments = degreeRequirementsMinor.flatMap(req => req.departments);

  const isInMajor = majorDepartments.includes(course.department);
  const isInMinor = minorDepartments.includes(course.department);
  
  if (isInMajor && isInMinor && greenDotCount < 3) {
    console.log('Course department:', course.department);
    const courseId = course.id; // Specify the course ID you want to find

    // Find the major requirement based on the course department
    const requirementMajor = degreeRequirementsMajor.find(req => req.departments.includes(course.department));
    console.log('Major requirement:', requirementMajor);

    // Find the minor requirement based on the course department
    const requirementMinor = degreeRequirementsMinor.find(req => req.departments.includes(course.department));
    console.log('Minor requirement:', requirementMinor);

    // Find the index of the given course within the subset of courses fulfilling the major requirement
    const courseIndexInRequirementMajor = findCourseIndexInRequirement(studentSchedule, courseId, requirementMajor);

    // Increment the green dot count if the course is within the first 3 courses fulfilling the major requirement
    if (courseIndexInRequirementMajor < 2) {
      greenDotCount++;
      return true;
    }
  }
  return false;
};



function findCourseIndexInRequirement(studentSchedule, courseId, requirement) {
  console.log('req: ', requirement)
  // Filter the student's schedule to get courses that fulfill the requirement
  const coursesInRequirement = studentSchedule.filter(course => {
    const matchedCourse = courseCatalog.find(c => c.id === course.courseId);
    
    return matchedCourse && requirement.departments.includes(matchedCourse.department);
  });

  // Find the index of the given course within the subset of courses fulfilling the requirement
  const index = coursesInRequirement.findIndex(course => course.courseId === courseId);

  return index;
}


<div className="message-container" id="messageContainer"></div>


return (
  <div className="tracking-sheet">
  <div className="button-container">
    <button
      className={activeRequirementType === 'major' ? 'active' : ''}
      onClick={() => setActiveRequirementType('major')}
    >
      COMPUTER SCIENCE MAJOR TRACKING SHEET
    </button>
    <button
      className={activeRequirementType === 'minor' ? 'active' : ''}
      onClick={() => setActiveRequirementType('minor')}
    >
      DATA SCIENCE MINOR TRACKING SHEET
    </button>
  </div>
  <div className="catalog-and-table">
    <div className="course-catalog">
    <h2 dangerouslySetInnerHTML={{ __html: requirementTableName }}></h2>

      <ul>{renderFilteredCourses()}</ul>
    </div>
    <div className="requirements-column">
      <div className="legend-container">
        <div className="legend">
          <div className="legend-item">
            <div className="dot" style={{ backgroundColor: '#4CAF50' }}></div>
            <span>--&ensp;DOUBLE COUNTED COURSE&ensp;&ensp;</span>
          </div>
          <div className="legend-item">
            <span style={{ color: 'rgb(155, 155, 155)' }}>Grey Course&ensp;</span>
            <span style={{ color: 'black' }}>--&ensp;COMPLETED</span>
          </div>
        </div>
      </div>
      <div className="requirements">{showWarning && (
      <div className="warning">
        <p>This course is completed and cannot be changed</p>
    </div>
  )}{renderTables(true)}</div>
    </div>
  </div>
</div>

);


};

export default TrackingSheetTab;