
exports.userTest = (req, res) => {
    console.log('Received:\n', req.body)
    res.json(req.body)
}