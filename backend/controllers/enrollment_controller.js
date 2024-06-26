const bcrypt = require('bcrypt');
const Enrollment = require('../models/enrollmentSchema.js');
const Course = require('../models/courseSchema.js');

const enrollmentRegister = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const existingEnrollment = await Enrollment.findOne({
            studentID: req.body.studentID,
            platform: req.body.adminID,
            courseName: req.body.courseName,
        });

        if (existingEnrollment) {
            res.send({ message: 'Student ID already exists in this course' });
        } else {
            const enrollment = new Enrollment({
                ...req.body,
                platform: req.body.adminID,
                password: hashedPass
            });

            let result = await enrollment.save();

            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const enrollmentLogIn = async (req, res) => {
    try {
        let enrollment = await Enrollment.findOne({ studentID: req.body.studentID, studentName: req.body.studentName });
        if (enrollment) {
            const validated = await bcrypt.compare(req.body.password, enrollment.password);
            if (validated) {
                enrollment = await enrollment.populate("platform", "platformName")
                enrollment = await enrollment.populate("courseName", "courseName")
                enrollment.password = undefined;
                enrollment.examResult = undefined;
                enrollment.attendance = undefined;
                res.send(enrollment);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Enrollment not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getEnrollments = async (req, res) => {
    try {
        let enrollments = await Enrollment.find({ platform: req.params.id }).populate("courseName", "courseName");
        if (enrollments.length > 0) {
            let modifiedEnrollments = enrollments.map((enrollment) => {
                return { ...enrollment._doc, password: undefined };
            });
            res.send(modifiedEnrollments);
        } else {
            res.send({ message: "No enrollments found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getEnrollmentDetail = async (req, res) => {
    try {
        let enrollment = await Enrollment.findById(req.params.id)
            .populate("platform", "platformName")
            .populate("courseName", "courseName")
            .populate("examResult.courseName", "courseName")
            .populate("attendance.courseName", "courseName sessions");
        if (enrollment) {
            enrollment.password = undefined;
            res.send(enrollment);
        } else {
            res.send({ message: "No enrollment found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const deleteEnrollment = async (req, res) => {
    try {
        const result = await Enrollment.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteEnrollments = async (req, res) => {
    try {
        const result = await Enrollment.deleteMany({ platform: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No enrollments found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteEnrollmentsByCourse = async (req, res) => {
    try {
        const result = await Enrollment.deleteMany({ courseName: req.params.id });
        if (result.deletedCount === 0) {
            res.send({ message: "No enrollments found to delete" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateEnrollment = async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        let result = await Enrollment.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });

        result.password = undefined;
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateExamResult = async (req, res) => {
    const { courseName, marksObtained } = req.body;

    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.send({ message: 'Enrollment not found' });
        }

        const existingResult = enrollment.examResult.find(
            (result) => result.courseName.toString() === courseName
        );

        if (existingResult) {
            existingResult.marksObtained = marksObtained;
        } else {
            enrollment.examResult.push({ courseName, marksObtained });
        }

        const result = await enrollment.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const enrollmentAttendance = async (req, res) => {
    const { courseName, status, date } = req.body;

    try {
        const enrollment = await Enrollment.findById(req.params.id);

        if (!enrollment) {
            return res.send({ message: 'Enrollment not found' });
        }

        const course = await Course.findById(courseName);

        const existingAttendance = enrollment.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString() &&
                a.courseName.toString() === courseName
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            // Check if the enrollment has already attended the maximum number of sessions
            const attendedSessions = enrollment.attendance.filter(
                (a) => a.courseName.toString() === courseName
            ).length;

            if (attendedSessions >= course.sessions) {
                return res.send({ message: 'Maximum attendance limit reached' });
            }

            enrollment.attendance.push({ date, status, courseName });
        }

        const result = await enrollment.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllEnrollmentsAttendanceByCourse = async (req, res) => {
    const courseName = req.params.id;

    try {
        const result = await Enrollment.updateMany(
            { 'attendance.courseName': courseName },
            { $pull: { attendance: { courseName } } }
        );
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const clearAllEnrollmentsAttendance = async (req, res) => {
    const platformId = req.params.id;

    try {
        const result = await Enrollment.updateMany(
            { platform: platformId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeEnrollmentAttendanceByCourse = async (req, res) => {
    const enrollmentId = req.params.id;
    const courseName = req.body.courseId;

    try {
        const result = await Enrollment.updateOne(
            { _id: enrollmentId },
            { $pull: { attendance: { courseName: courseName } } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

const removeEnrollmentAttendance = async (req, res) => {
    const enrollmentId = req.params.id;

    try {
        const result = await Enrollment.updateOne(
            { _id: enrollmentId },
            { $set: { attendance: [] } }
        );

        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    enrollmentRegister,
    enrollmentLogIn,
    getEnrollments,
    getEnrollmentDetail,
    deleteEnrollments,
    deleteEnrollment,
    updateEnrollment,
    enrollmentAttendance,
    deleteEnrollmentsByCourse,
    updateExamResult,

    clearAllEnrollmentsAttendanceByCourse,
    clearAllEnrollmentsAttendance,
    removeEnrollmentAttendanceByCourse,
    removeEnrollmentAttendance,
};
