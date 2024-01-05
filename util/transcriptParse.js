// const fs = require('fs');
// const pdf = require('pdf-parse');
import * as fs from 'fs'
import pdf from 'pdf-parse'

const transcriptParse = (filePath) => {
    return new Promise((resolve, reject) => {
        let dataBuffer = fs.readFileSync(filePath);
        let student_info;
    
        pdf(dataBuffer).then(function(data) {
            let stu_roll_number = data.text.split('Roll No. :')[1].split('\n')[1].split('-').join('').slice(2);
            let stu_major = data.text.split('Major:')[1].split('\n')[1]
            let [stu_credits, stu_cgpa] = data.text.split('CREDITS')[3].split('\n')[2].split('TAKEN TOWARDS GPA')[1].split('CGPA');
            let admitted_year = data.text.split('Year Admitted:')[1].split('\n')[1].trim().split('-')[0];
            let semesters = data.text.split('CREDITS')[2].split(/\n\s*\n/).slice(1);
            let course_info = [];
            for (let semester of semesters) {
                let courses = semester.split(/\n(.*)/s)[1].split('\n');
                
                for (let course of courses) {
                    let lastDigitIndex = course.search(/\d(?!.*\d)/); // Find the index of the last digit
                    let course_grade = course.slice(lastDigitIndex + 1);
                    let tempString = course.slice(0, lastDigitIndex);
                    let secondSpaceIndex = tempString.indexOf(' ', tempString.indexOf(' ') + 1); // Find the index of the second space
                    let course_code = tempString.substring(0, secondSpaceIndex);
                    let course_name = tempString.substring(secondSpaceIndex + 1);

                    if (course_grade.includes('R')) {
                        course_grade = course_grade.split('R')[0];
                    }

                    if (course_code != '' && !course_grade.includes('#')) {
                        course_info.push(
                            {
                                code: course_code,
                                name: course_name,
                                grade: course_grade == '' ? null : course_grade
                            }
                        );
                    }
                }
            }
            student_info = {
                roll_number: stu_roll_number,
                major: stu_major,
                admitted: admitted_year,
                credits: parseInt(stu_credits),
                cgpa: parseFloat(stu_cgpa),
                semesters: semesters.length,
                course_info: course_info
            }
            resolve(student_info)
        })
        .catch((err) => {
            reject(err)
        })
    });
}

export default transcriptParse;
 
