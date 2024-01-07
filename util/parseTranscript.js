import pdf from 'pdf-parse'

const parseTranscript = (file) => {
    return new Promise((resolve, reject) => {
        let student_info;
        let error_flag = false;
    
        pdf(file).then(function(data) {
            let stu_roll_number = data.text.split('Roll No. :')[1].split('\n')[1].split('-').join('').slice(2);
            let stu_major = data.text.split('Major:')[1].split('\n')[1]
            let [stu_credits, stu_cgpa] = data.text.split('CREDITS')[3].split('\n')[2].split('TAKEN TOWARDS GPA')[1].split('CGPA');
            let admitted_year = data.text.split('Year Admitted:')[1].split('\n')[1].trim().split('-')[0];
            let semesters = data.text.split('CREDITS')[2].split(/\n\s*\n/).slice(1);
            let sem_info = []
            for (let semester of semesters) {
                let curr_sem = semester.split(/\n(.*)/s)[0].split('Semester ').join('');
                let courses = semester.split(/\n(.*)/s)[1].split('\n');
                let course_info = [];
                
                for (let course of courses) {
                    let lastDigitIndex = course.search(/\d(?!.*\d)/); // Find the index of the last digit
                    let course_grade = course.slice(lastDigitIndex + 1);
                    let tempString = course.slice(0, lastDigitIndex);
                    let course_credits = course.substring(lastDigitIndex, lastDigitIndex + 1);
                    let secondSpaceIndex = tempString.indexOf(' ', tempString.indexOf(' ') + 1); // Find the index of the second space
                    let course_code = tempString.substring(0, secondSpaceIndex);
                    let course_name = tempString.substring(secondSpaceIndex + 1);

                    if (course_grade.includes('R')) {
                        course_grade = course_grade.split('R')[0];
                    }

                    if (course_code != '' && !course_grade.includes('#') && !course_grade.includes('W')) { // Not Withdrawn or Replaced
                        course_info.push(
                            {
                                code: course_code,
                                name: course_name,
                                credits: parseInt(course_credits),
                                grade: course_grade == '' ? null : course_grade
                            }
                        );

                        !/^[A-Z]{2,4} \d{3}[A-Z]?$/.test(course_code) ? error_flag = true : null;
                        !/^[0-9]$/.test(course_credits) ? error_flag = true : null;
                        !/^[A-Z]?[+-]?$/.test(course_grade) ? error_flag = true : null;
                    }
                }
                sem_info.push(
                    {
                        semester: curr_sem,
                        course_info: course_info
                    }
                )
            }

            !/^(200[1-9]|20[1-9]\d)$/.test(admitted_year) ? error_flag = true : null;
            !/^\d{8}$/.test(stu_roll_number) ? error_flag = true : null;
            !/^[A-Za-z\s]+$/.test(stu_major) ? error_flag = true : null;

            student_info = {
                roll_number: stu_roll_number,
                major: stu_major,
                admitted: admitted_year,
                credits: parseInt(stu_credits),
                cgpa: parseFloat(stu_cgpa),
                semesters: sem_info
            }
            resolve(!error_flag ? student_info : false)
        })
        .catch((err) => {
            reject(false)
        })
    });
}

export default parseTranscript;
 
