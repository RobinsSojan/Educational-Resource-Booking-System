const bcrypt = require('bcrypt');
const User = require('../models/userSchema.js');
const Course = require('../models/courseSchema.js');
const Enrollment = require('../models/enrollmentSchema.js');
const Instructor = require('../models/instructorSchema.js');
const Module = require('../models/moduleSchema.js');
const Announcement = require('../models/announcementSchema.js');
const Feedback = require('../models/feedbackSchema.js');

// const userRegister = async (req, res) => {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPass = await bcrypt.hash(req.body.password, salt);

//         const user = new User({
//             ...req.body,
//             password: hashedPass
//         });

//         const existingUserByEmail = await User.findOne({ email: req.body.email });
//         const existingUsername = await User.findOne({ username: req.body.username });

//         if (existingUserByEmail) {
//             res.send({ message: 'Email already exists' });
//         }
//         else if (existingUsername) {
//             res.send({ message: 'Username already exists' });
//         }
//         else {
//             let result = await user.save();
//             result.password = undefined;
//             res.send(result);
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };

// const userLogIn = async (req, res) => {
//     if (req.body.email && req.body.password) {
//         let user = await User.findOne({ email: req.body.email });
//         if (user) {
//             const validated = await bcrypt.compare(req.body.password, user.password);
//             if (validated) {
//                 user.password = undefined;
//                 res.send(user);
//             } else {
//                 res.send({ message: "Invalid password" });
//             }
//         } else {
//             res.send({ message: "User not found" });
//         }
//     } else {
//         res.send({ message: "Email and password are required" });
//     }
// };

const userRegister = async (req, res) => {
    try {
        const user = new User({
            ...req.body
        });

        const existingUserByEmail = await User.findOne({ email: req.body.email });
        const existingUsername = await User.findOne({ username: req.body.username });

        if (existingUserByEmail) {
            res.send({ message: 'Email already exists' });
        }
        else if (existingUsername) {
            res.send({ message: 'Username already exists' });
        }
        else {
            let result = await user.save();
            result.password = undefined;
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const userLogIn = async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            if (req.body.password === user.password) {
                user.password = undefined;
                res.send(user);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "User not found" });
        }
    } else {
        res.send({ message: "Email and password are required" });
    }
};

const getUserDetail = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (user) {
            user.password = undefined;
            res.send(user);
        }
        else {
            res.send({ message: "No user found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
}

// const deleteUser = async (req, res) => {
//     try {
//         const result = await User.findByIdAndDelete(req.params.id)

//         await Course.deleteMany({ user: req.params.id });
//         await Enrollment.deleteMany({ user: req.params.id });
//         await Instructor.deleteMany({ user: req.params.id });
//         await Module.deleteMany({ user: req.params.id });
//         await Announcement.deleteMany({ user: req.params.id });
//         await Feedback.deleteMany({ user: req.params.id });

//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// const updateUser = async (req, res) => {
//     try {
//         if (req.body.password) {
//             const salt = await bcrypt.genSalt(10)
//             req.body.password = await bcrypt.hash(req.body.password, salt)
//         }
//         let result = await User.findByIdAndUpdate(req.params.id,
//             { $set: req.body },
//             { new: true })

//         result.password = undefined;
//         res.send(result)
//     } catch (error) {
//         res.status(500).json(err);
//     }
// }

// module.exports = { userRegister, userLogIn, getUserDetail, deleteUser, updateUser };

module.exports = { userRegister, userLogIn, getUserDetail };
