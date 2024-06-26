const bcrypt = require('bcrypt');
const Instructor = require('../models/instructorSchema.js');
const Module = require('../models/moduleSchema.js');

const instructorRegister = async (req, res) => {
    const { name, email, password, role, platform, teachModule, teachCourse } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const instructor = new Instructor({ name, email, password: hashedPass, role, platform, teachModule, teachCourse });

        const existingInstructorByEmail = await Instructor.findOne({ email });

        if (existingInstructorByEmail) {
            res.send({ message: 'Email already exists' });
        } else {
            let result = await instructor.save();
            await Module.findByIdAndUpdate(teachModule, { instructor: instructor._id });
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const instructorLogIn = async (req, res) => {
    try {
        let instructor = await Instructor.findOne({ email: req.body.email });
        if (instructor) {
            const validated = await bcrypt.compare(req.body.password, instructor.password);
            if (validated) {
                instructor = await instructor.populate("teachModule", "moduleName sessions")
                instructor = await instructor.populate("platform", "platformName")
                instructor = await instructor.populate("teachCourse", "courseName")
                instructor.password = undefined;
                res.send(instructor);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Instructor not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getInstructors = async (req, res) => {
    try {
        let instructors = await Instructor.find({ platform: req.params.id })
            .populate("teachModule", "moduleName")
            .populate("teachCourse", "courseName");
        if (instructors.length > 0) {
            let modifiedInstructors = instructors.map((instructor) => {
                return { ...instructor._doc, password: undefined };
            });
            res.send(modifiedInstructors);
        } else {
            res.send({ message: "No instructors found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getInstructorDetail = async (req, res) => {
    try {
        let instructor = await Instructor.findById(req.params.id)
            .populate("teachModule", "moduleName sessions")
            .populate("platform", "platformName")
            .populate("teachCourse", "courseName");
        if (instructor) {
            instructor.password = undefined;
            res.send(instructor);
        } else {
            res.send({ message: "No instructor found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

const updateInstructorModule = async (req, res) => {
    const { instructorId, teachModule } = req.body;
    try {
        const updatedInstructor = await Instructor.findByIdAndUpdate(
            instructorId,
            { teachModule },
            { new: true }
        );

        await Module.findByIdAndUpdate(teachModule, { instructor: updatedInstructor._id });

        res.send(updatedInstructor);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteInstructor = async (req, res) => {
    try {
        const deletedInstructor = await Instructor.findByIdAndDelete(req.params.id);

        await Module.updateOne(
            { instructor: deletedInstructor._id, instructor: { $exists: true } },
            { $unset: { instructor: 1 } }
        );

        res.send(deletedInstructor);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteInstructors = async (req, res) => {
    try {
        const deletionResult = await Instructor.deleteMany({ platform: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No instructors found to delete" });
            return;
        }

        const deletedInstructors = await Instructor.find({ platform: req.params.id });

        await Module.updateMany(
            { instructor: { $in: deletedInstructors.map(instructor => instructor._id) }, instructor: { $exists: true } },
            { $unset: { instructor: "" }, $unset: { instructor: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteInstructorsByCourse = async (req, res) => {
    try {
        const deletionResult = await Instructor.deleteMany({ courseName: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No instructors found to delete" });
            return;
        }

        const deletedInstructors = await Instructor.find({ courseName: req.params.id });

        await Module.updateMany(
            { instructor: { $in: deletedInstructors.map(instructor => instructor._id) }, instructor: { $exists: true } },
            { $unset: { instructor: "" }, $unset: { instructor: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const instructorAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const instructor = await Instructor.findById(req.params.id);

        if (!instructor) {
            return res.send({ message: 'Instructor not found' });
        }

        const existingAttendance = instructor.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            instructor.attendance.push({ date, status });
        }

        const result = await instructor.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    instructorRegister,
    instructorLogIn,
    getInstructors,
    getInstructorDetail,
    updateInstructorModule,
    deleteInstructor,
    deleteInstructors,
    deleteInstructorsByCourse,
    instructorAttendance
};
