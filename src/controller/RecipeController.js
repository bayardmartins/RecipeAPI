module.exports = {
    async get (req,res) {
        const { i } = req.query;
        return res.send(i);
    }
}