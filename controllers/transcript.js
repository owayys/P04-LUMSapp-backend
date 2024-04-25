import parseTranscript from "../util/parseTranscript.js";

export const transcriptParser = async (req, res) => {
    let transcriptFile;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            success: false,
            message: "No files were uploaded.",
        });
    }

    transcriptFile = req.files.file;

    parseTranscript(transcriptFile.data)
        .then((parsedData) => {
            if (parsedData) {
                return res.status(200).json({
                    success: true,
                    message: "Transcript parsed successfully",
                    parsedData,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Transcript.",
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        });
};
