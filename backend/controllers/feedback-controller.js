const Feedback = require('../models/feedbackSchema.js');

const feedbackCreate = async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        const result = await feedback.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const feedbackList = async (req, res) => {
    try {
        let feedbacks = await Feedback.find({ course: req.params.id }).populate("user", "name");
        if (feedbacks.length > 0) {
            res.send(feedbacks);
        } else {
            res.send({ message: "No feedbacks found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { feedbackCreate, feedbackList };
