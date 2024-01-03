// const fs = require('fs');
// const pdf = require('pdf-parse');
import * as fs from 'fs'
import pdf from 'pdf-parse'

const pdfParse = (filePath) => {
    let dataBuffer = fs.readFileSync(filePath);
 
    pdf(dataBuffer).then(function(data) {
     
        // number of pages
        console.log(data.numpages);
        // number of rendered pages
        console.log(data.numrender);
        // PDF info
        console.log(data.info);
        // PDF metadata
        console.log(data.metadata); 
        // PDF.js version
        // check https://mozilla.github.io/pdf.js/getting_started/
        console.log(data.version);
        // PDF text
        console.log(data.text); 

        console.log(data)
            
    });
}

pdfParse('uploads/RA6_Solution.pdf')

export default pdfParse;
 
