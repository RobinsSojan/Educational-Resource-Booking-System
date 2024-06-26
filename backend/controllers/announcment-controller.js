const Announcement = require('../models/announcementSchema.js');

const announcementCreate = async (req, res) => {
    try {
        const announcement = new Announcement({
            ...req.body,
            platform: req.body.adminID
        });
        const result = await announcement.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};

const announcementList = async (req, res) => {
    try {
        let announcements = await Announcement.find({ platform: req.params.id });
        if (announcements.length > 0) {
            res.send(announcements);
        } else {
            res.send({ message: "No announcements found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateAnnouncement = async (req, res) => {
    try {
        const result = await Announcement.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteAnnouncement = async (req, res) => {
    try {
        const result = await Announcement.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteAnnouncements = async (req, res) => {
    try {
        const result = await Announcement.deleteMany({ platform: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No announcements found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { announcementCreate, announcementList, updateAnnouncement, deleteAnnouncement, deleteAnnouncements };
