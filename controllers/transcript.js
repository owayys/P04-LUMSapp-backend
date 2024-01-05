import transcriptParse from "../util/transcriptParse.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const parseTranscript = async (req, res) => {
    let transcriptFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No files were uploaded.',
        });
    }
    
    transcriptFile = req.files.file;
    uploadPath = __dirname.split('/').slice(0, 3).join('/') + '/uploads/' + transcriptFile.name;
    
    transcriptFile.mv(uploadPath, function(err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    })
    
    transcriptParse(uploadPath)
        .then((parsedData) => {
            res.status(200).json({
                success: true,
                message: "Transcript parsed successfully",
                parsedData
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        });
};