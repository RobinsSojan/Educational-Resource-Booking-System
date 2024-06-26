const Module = require('../models/moduleSchema.js');
const Instructor = require('../models/instructorSchema.js');
const Enrollment = require('../models/enrollmentSchema.js');

const moduleCreate = async (req, res) => {
    try {
        const modules = req.body.modules.map((module) => ({
            moduleName: module.moduleName,
            moduleCode: module.moduleCode,
            sessions: module.sessions,
        }));

        const existingModuleByModuleCode = await Module.findOne({
            'modules.moduleCode': modules[0].moduleCode,
            platform: req.body.adminID,
        });

        if (existingModuleByModuleCode) {
            res.send({ message: 'Sorry, this module code must be unique as it already exists' });
        } else {
            const newModules = modules.map((module) => ({
                ...module,
                courseName: req.body.courseName,
                platform: req.body.adminID,
            }));

            const result = await Module.insertMany(newModules);
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const allModules = async (req, res) => {
    try {
        let modules = await Module.find({ platform: req.params.id })
            .populate("courseName", "courseName");
        if (modules.length > 0) {
            res.send(modules);
        } else {
            res.send({ message: "No modules found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const courseModules = async (req, res) => {
    try {
        let modules = await Module.find({ courseName: req.params.id });
        if (modules.length > 0) {
            res.send(modules);
        } else {
            res.send({ message: "No modules found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const freeModuleList = async (req, res) => {
    try {
        let modules = await Module.find({ courseName: req.params.id, instructor: { $exists: false } });
        if (modules.length > 0) {
            res.send(modules);
        } else {
            res.send({ message: "No modules found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getModuleDetail = async (req, res) => {
    try {
        let module = await Module.findById(req.params.id);
        if (module) {
            module = await module.populate("courseName", "courseName")
            module = await module.populate("instructor", "name");
            res.send(module);
        } else {
            res.send({ message: "No module found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteModule = async (req, res) => {
    try {
        const deletedModule = await Module.findByIdAndDelete(req.params.id);

        // Set the teachModule field to null in instructors
        await Instructor.updateOne(
            { teachModule: deletedModule._id },
            { $unset: { teachModule: "" }, $unset: { teachModule: null } }
        );

        // Remove the objects containing the deleted module from enrollments' examResult array
        await Enrollment.updateMany(
            {},
            { $pull: { examResult: { moduleName: deletedModule._id } } }
        );

        // Remove the objects containing the deleted module from enrollments' attendance array
        await Enrollment.updateMany(
            {},
            { $pull: { attendance: { moduleName: deletedModule._id } } }
        );

        res.send(deletedModule);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteModules = async (req, res) => {
    try {
        const deletedModules = await Module.deleteMany({ platform: req.params.id });

        // Set the teachModule field to null in instructors
        await Instructor.updateMany(
            { teachModule: { $in: deletedModules.map(module => module._id) } },
            { $unset: { teachModule: "" }, $unset: { teachModule: null } }
        );

        // Set examResult and attendance to null in all enrollments
        await Enrollment.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.send(deletedModules);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteModulesByCourse = async (req, res) => {
    try {
        const deletedModules = await Module.deleteMany({ courseName: req.params.id });

        // Set the teachModule field to null in instructors
        await Instructor.updateMany(
            { teachModule: { $in: deletedModules.map(module => module._id) } },
            { $unset: { teachModule: "" }, $unset: { teachModule: null } }
        );

        // Set examResult and attendance to null in all enrollments
        await Enrollment.updateMany(
            {},
            { $set: { examResult: null, attendance: null } }
        );

        res.send(deletedModules);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { moduleCreate, freeModuleList, courseModules, getModuleDetail, deleteModulesByCourse, deleteModules, deleteModule, allModules };
