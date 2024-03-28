import fs from "fs";
import pdf from "pdf-parse";
import { Course } from "../models/courses.js";
import { connectDatabase } from "../db/index.js";


function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  }

  async function insertCourseData(course) {
    try {
        const doc = await course.save();
        console.log('Course saved successfully:', doc);
    } catch (error) {
        console.error('Error saving course:', error);
    }
}

function extractCourseDetails(courseBlock) {
    const courseDetails = courseBlock[0];
    
   
    // ACCT 100 LEC 1Principles of Financial Accounting16W3TTh 9:25 AM-10:30 AMSDSB 203
    // ACCT 100 LEC 2Principles of Financial Accounting16W3MW 10:45 AM-11:50 AMAcad Block A-4
    // ACTA 6201 LEC 1Business Analytics - FoundationsMS23SSu 10:35 AM-12:20 PMSDSB 201
    // BIO 100 LEC 5Biology Laboratory8W21Th 8:55 AM-9:40 AMSBASSE 10-302
    // CHE 300B LAB 1Chemical Engineering Lab III16W1M 1:05 PM-3:40 PMSBASSE CH TCHLAB2

    const detailsRegex = /^(?<dept>[A-Z]+) (?<number>\d+[A-Za-z]?) (?<type>LEC|LAB|SEM|RAC|PRT) (?<section>\d+)(?<title>[A-Za-z -:,]+)(?<session>16W\d|8W\d{2}|10W\d{1,2}|MS\d{2})(?<days>[RMTWFSsuTh]+) (?<startTime>\d{1,2}:\d{2} [AP]M)-(?<endTime>\d{1,2}:\d{2} [AP]M)(?<location>.*)$/;
    

    const match=  courseDetails.match(detailsRegex);

    if (!match) {
        console.error('Failed to match course details:', courseDetails);
        return null;
    }

    const instructors = courseBlock.slice(1);



    const { dept, number, section, title, days, startTime, endTime, location } = match.groups;

    const daysArray = days.match(/(Th|T|W|F|Su|M)/g) || [];
    const instructor = courseBlock.slice(1).join(', ');
    let startTime2 = convertTime12to24(startTime);
    let endTime2 = convertTime12to24(endTime);

    console.log(instructor)
    
    return new Course({
        name: title.trim(),
        section: section,
        courseCode: `${dept} ${number}`,
        startTime: startTime2,
        endTime: endTime2,
        days: daysArray,
        instructor: instructor,
        description: 'Default description', // Modify as needed
        location: location.trim(),
    });


}

  

const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  try {
    const data = await pdf(dataBuffer);

    const lines = data.text.split("\n").slice(5);
    console.log(lines);



    
    

    let currentBlock = [];
    const courses = [];

    lines.forEach((line) => {
      if (line.match(/^\w+ \d+/)) {
        if (currentBlock.length) {
    
        const course = extractCourseDetails(currentBlock);
          if (course) insertCourseData(course);
          currentBlock = [];
        
        }
      }
      currentBlock.push(line);
    });


    if (currentBlock.length) {
   
    const course = extractCourseDetails(currentBlock);
    if (course) insertCourseData(course);
    }


  } catch (error) {
    console.error("Error parsing PDF:", error);
  }
};




connectDatabase().then(() => {parsePDF(
    "/Users/sarfrazhussain/Documents/GitHub/P04-LUMSapp-backend/Spring Semester 2024 - Ramzan Class Schedule.pdf"
    );} ).catch((error) => {
    console.error('Error connecting to database:', error);

});

