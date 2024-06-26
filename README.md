<h1 align="center">
    EDUCATIONAL RESOURCE BOOKING SYSTEM 
</h1>

<h3 align="center">
Streamline resource management, booking processes, and add students and faculty.<br>
Seamlessly track usage, assess availability, and provide feedback.<br>
Access records, view schedules, and communicate effortlessly.
</h3>



# About

The Educational Resource Booking System is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to streamline resource management, booking processes, and facilitate communication between students, teachers, and administrators.

## Features

- **User Roles:** The system supports three user roles: Admin, Teacher, and Student. Each role has specific functionalities and access levels.

- **Admin Dashboard:** Administrators can add new students and teachers, create classes and subjects, manage user accounts, and oversee system settings.

- **Resource Booking:** Teachers and students can book resources for their classes, mark resources as available or unavailable, and generate booking reports.

- **Performance Assessment:** Teachers can assess students' usage of resources by providing feedback. Students can view their booking history and track their usage over time.

- **Data Visualization:** Users can visualize their booking data through interactive charts and tables, helping them understand resource utilization at a glance.

- **Communication:** Users can communicate effortlessly through the system. Teachers can send messages to students and vice versa, promoting effective communication and collaboration.

## Technologies Used

- Frontend: React.js, Material UI, Redux
- Backend: Node.js, Express.js
- Database: MongoDB

<br>
# Installation

```sh
git clone (current github link)

Open 2 terminals in separate windows/tabs.

Terminal 1: Setting Up Backend

sh
Copy code
cd backend
npm install
npm start

Create a file called .env in the backend folder.
Inside it write this :

sh
Copy code
MONGO_URL = mongodb://127.0.0.1/school

f you are using MongoDB Compass you can use this database link but if you are using MongoDB Atlas then instead of this link write your own database link.

Terminal 2: Setting Up Frontend

sh
Copy code
cd frontend
npm install
npm start

Now, navigate to localhost:3000 in your browser.
The Backend API will be running at localhost:5000.
<br>

Error Solution
You might encounter an error while signing up, either a network error or a loading error that goes on indefinitely.

To resolve it:

Navigate to the frontend > .env file.

Uncomment the first line. After that, terminate the frontend terminal. Open a new terminal and execute the following commands:

sh
Copy code
cd frontend
npm start

After completing these steps, try signing up again. If the issue persists, follow these additional steps to resolve it:

Navigate to the frontend > src > redux > userRelated > userHandle.js file.

Add the following line after the import statements:

javascript
Copy code
const REACT_APP_BASE_URL = "http://localhost:5000";