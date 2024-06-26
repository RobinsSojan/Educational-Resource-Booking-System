const router = require('express').Router();

const { adminRegister, adminLogIn, getAdminDetail } = require('../controllers/admin-controller.js');

const { courseCreate, courseList, deleteCourse, deleteCourses, getCourseDetail, getCourseLearners } = require('../controllers/course-controller.js');
const { feedbackCreate, feedbackList } = require('../controllers/feedback-controller.js');
const { announcementCreate, announcementList, deleteAnnouncements, deleteAnnouncement, updateAnnouncement } = require('../controllers/announcement-controller.js');
const {
    learnerRegister,
    learnerLogIn,
    getLearners,
    getLearnerDetail,
    deleteLearners,
    deleteLearner,
    updateLearner,
    learnerAttendance,
    deleteLearnersByCourse,
    updateExamResult,
    clearAllLearnersAttendanceByModule,
    clearAllLearnersAttendance,
    removeLearnerAttendanceByModule,
    removeLearnerAttendance } = require('../controllers/learner-controller.js');
const { moduleCreate, courseModules, deleteModulesByCourse, getModuleDetail, deleteModule, freeModuleList, allModules, deleteModules } = require('../controllers/module-controller.js');
const { instructorRegister, instructorLogIn, getInstructors, getInstructorDetail, deleteInstructors, deleteInstructorsByCourse, deleteInstructor, updateInstructorModule, instructorAttendance } = require('../controllers/instructor-controller.js');

// Admin
router.post('/AdminReg', adminRegister);
router.post('/AdminLogin', adminLogIn);
router.get("/Admin/:id", getAdminDetail);

// Learner
router.post('/LearnerReg', learnerRegister);
router.post('/LearnerLogin', learnerLogIn);
router.get("/Learners/:id", getLearners);
router.get("/Learner/:id", getLearnerDetail);
router.delete("/Learners/:id", deleteLearners);
router.delete("/LearnersCourse/:id", deleteLearnersByCourse);
router.delete("/Learner/:id", deleteLearner);
router.put("/Learner/:id", updateLearner);
router.put('/UpdateExamResult/:id', updateExamResult);
router.put('/LearnerAttendance/:id', learnerAttendance);
router.put('/RemoveAllLearnersModuleAtten/:id', clearAllLearnersAttendanceByModule);
router.put('/RemoveAllLearnersAtten/:id', clearAllLearnersAttendance);
router.put('/RemoveLearnerModuleAtten/:id', removeLearnerAttendanceByModule);
router.put('/RemoveLearnerAtten/:id', removeLearnerAttendance);

// Instructor
router.post('/InstructorReg', instructorRegister);
router.post('/InstructorLogin', instructorLogIn);
router.get("/Instructors/:id", getInstructors);
router.get("/Instructor/:id", getInstructorDetail);
router.delete("/Instructors/:id", deleteInstructors);
router.delete("/InstructorsCourse/:id", deleteInstructorsByCourse);
router.delete("/Instructor/:id", deleteInstructor);
router.put("/InstructorModule", updateInstructorModule);
router.post('/InstructorAttendance/:id', instructorAttendance);

// Announcement
router.post('/AnnouncementCreate', announcementCreate);
router.get('/AnnouncementList/:id', announcementList);
router.delete("/Announcements/:id", deleteAnnouncements);
router.delete("/Announcement/:id", deleteAnnouncement);
router.put("/Announcement/:id", updateAnnouncement);

// Feedback
router.post('/FeedbackCreate', feedbackCreate);
router.get('/FeedbackList/:id', feedbackList);

// Course
router.post('/CourseCreate', courseCreate);
router.get('/CourseList/:id', courseList);
router.get("/Course/:id", getCourseDetail);
router.get("/Course/Learners/:id", getCourseLearners);
router.delete("/Courses/:id", deleteCourses);
router.delete("/Course/:id", deleteCourse);

// Module
router.post('/ModuleCreate', moduleCreate);
router.get('/AllModules/:id', allModules);
router.get('/CourseModules/:id', courseModules);
router.get('/FreeModuleList/:id', freeModuleList);
router.get("/Module/:id", getModuleDetail);
router.delete("/Module/:id", deleteModule);
router.delete("/Modules/:id", deleteModules);
router.delete("/ModulesCourse/:id", deleteModulesByCourse);

module.exports = router;
