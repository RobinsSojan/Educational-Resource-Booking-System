const Course = require('../models/courseSchema.js');
const Student = require('../models/enrollmentSchema.js');
const Module = require('../models/moduleSchema.js');
const Instructor = require('../models/instructorSchema.js');

const courseCreate = async (req, res) => {
    try {
        const course = new Course({
            courseName: req.body.courseName,
            platform: req.body.adminID
        });

        const existingCourseByName = await Course.findOne({
            courseName: req.body.courseName,
            platform: req.body.adminID
        });

        if (existingCourseByName) {
            res.send({ message: 'Sorry, this course name already exists' });
        } else {
            const result = await course.save();
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const courseList = async (req, res) => {
    try {
        let courses = await Course.find({ platform: req.params.id });
        if (courses.length > 0) {
            res.send(courses);
        } else {
            res.send({ message: "No courses found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getCourseDetail = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (course) {
            course = await course.populate("platform", "platformName");
            res.send(course);
        } else {
            res.send({ message: "No course found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getCourseStudents = async (req, res) => {
    try {
        let students = await Student.find({ courseName: req.params.id });
        if (students.length > 0) {
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteCourse = async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.send({ message: "Course not found" });
        }
        await Student.deleteMany({ courseName: req.params.id });
        await Module.deleteMany({ courseName: req.params.id });
        await Instructor.deleteMany({ teachCourse: req.params.id });
        res.send(deletedCourse);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteCourses = async (req, res) => {
    try {
        const deletedCourses = await Course.deleteMany({ platform: req.params.id });
        if (deletedCourses.deletedCount === 0) {
            return res.send({ message: "No courses found to delete" });
        }
        await Student.deleteMany({ platform: req.params.id });
        await Module.deleteMany({ platform: req.params.id });
        await Instructor.deleteMany({ platform: req.params.id });
        res.send(deletedCourses);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { courseCreate, courseList, deleteCourse, deleteCourses, getCourseDetail, getCourseStudents };
