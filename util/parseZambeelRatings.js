import fs from "fs";
import pdf from "pdf-parse";
import { Instructor } from "../models/instructor.js"
import { connectDatabase } from "../db/index.js";

const subjArea = [
  "ACCT",
  "ACF ",
  "ACTA",
  "ANTH",
  "BIO ",
  "BPP ",
  "CHE ",
  "CHEM",
  "CLCS",
  "CS  ",
  "DISC",
  "ECON",
  "EDU ",
  "EDUX",
  "EE  ",
  "EMBA",
  "ENGG",
  "ENGL",
  "ENV ",
  "FINN",
  "FMG ",
  "GSL ",
  "GSS ",
  "HIST",
  "HMI ",
  "LANG",
  "LAW ",
  "MATH",
  "MBA ",
  "MECO",
  "MGMT",
  "MKTG",
  "ORSC",
  "PHIL",
  "PHY ",
  "POL ",
  "PSY ",
  "REL ",
  "SCI ",
  "SCRM",
  "SOC ",
  "SS  ",
  "SWR ",
  "TME ",
];

const parsePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const lines = data.text.split("\n"); // Split the text into lines

    console.log("---STARTING---")
    let concatenatedLines = [];
    let skipNextLine = false;
    let IDpadding = 10; // pad employee id length

    lines.forEach((line, index) => {  // fixes the issue of course info being split into two lines
      if (skipNextLine) {
        skipNextLine = false;
        return;
      }

      if (subjArea.includes(line.substring(0, 4)) && index < lines.length - 1) {  // only keep those lines starting with subj area
        concatenatedLines.push(line + lines[index + 1]);
        skipNextLine = true;
      } else {
        concatenatedLines.push(line);
      }
    });

    let employeesRating = {}

    concatenatedLines.forEach(line => {
      const thirdLastChar = line.charAt(line.length - 3);  // only keep those with a weighted average at end 
      if (thirdLastChar === ".") {
        const lastEPosition = line.lastIndexOf("E");
        const startOfName = line.substring(lastEPosition + IDpadding);
        const alphabetPart = startOfName.match(/^[a-zA-Z\s]+/);
        if (alphabetPart) {
          // console.log(alphabetPart[0]);
          const weightedAverage = line.substring(line.length - 4, line.length);
          // console.log(weightedAverage)
            if (employeesRating.hasOwnProperty(alphabetPart[0])) {
              const previousRating = employeesRating[alphabetPart[0]];
              const averageRating = (parseFloat(previousRating) + parseFloat(weightedAverage)) / 2;
              employeesRating[alphabetPart[0]] = averageRating.toFixed(2);
            } else {
              employeesRating[alphabetPart[0]] = weightedAverage;
            }

        }
        
      }
    }
  );
  const correctedEmployeesRating = {};

  // Iterate over the original object and add entries with string keys having more than one word
  for (const key in employeesRating) {
      if (Object.prototype.hasOwnProperty.call(employeesRating, key) && typeof key === 'string' && key.split(' ').length > 1) {
          correctedEmployeesRating[key] = employeesRating[key];
      }
  }
  
  // Output the corrected object
  // console.log(correctedEmployeesRating);
  uploadRatings(correctedEmployeesRating)

  } catch (error) {
    console.log(error.message);
  }
};


const uploadRatings = async (instructorRatingDict) => {
  
  for (const key in instructorRatingDict) {
    if (Object.hasOwnProperty.call(instructorRatingDict, key)) {
      // console.log("name: ", key, "value", instructorRatingDict[key])
      const instructor = await Instructor.findOne({ instructorName: key });
      if (instructor) {
        console.log("Changed rating for: ", key)
        instructor.zambeelRating = instructorRatingDict[key];
        await instructor.save();
      }
    }
  }

  console.log("---Ended---")
}

connectDatabase()
  .then(() => {
    parsePDF(
      "./assets/CourseInstructorEvaluationReport-Fall 2023-2301 (1).pdf"
    );
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
