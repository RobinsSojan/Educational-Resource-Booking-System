export const calculateModuleAttendancePercentage = (presentCount, totalSessions) => {
    if (totalSessions === 0 || presentCount === 0) {
        return 0;
    }
    const percentage = (presentCount / totalSessions) * 100;
    return percentage.toFixed(2); // Limit to two decimal places
};

export const groupAttendanceByModule = (moduleAttendance) => {
    const attendanceByModule = {};

    moduleAttendance.forEach((attendance) => {
        const moduleName = attendance.moduleName.moduleName;
        const sessions = attendance.moduleName.sessions;
        const moduleId = attendance.moduleName._id;

        if (!attendanceByModule[moduleName]) {
            attendanceByModule[moduleName] = {
                present: 0,
                absent: 0,
                sessions: sessions,
                allData: [],
                moduleId: moduleId
            };
        }
        if (attendance.status === "Present") {
            attendanceByModule[moduleName].present++;
        } else if (attendance.status === "Absent") {
            attendanceByModule[moduleName].absent++;
        }
        attendanceByModule[moduleName].allData.push({
            date: attendance.date,
            status: attendance.status,
        });
    });
    return attendanceByModule;
};

export const calculateOverallAttendancePercentage = (moduleAttendance) => {
    let totalSessionsSum = 0;
    let presentCountSum = 0;
    const uniqueModuleIds = [];

    moduleAttendance.forEach((attendance) => {
        const moduleId = attendance.moduleName._id;
        if (!uniqueModuleIds.includes(moduleId)) {
            const sessions = parseInt(attendance.moduleName.sessions);
            totalSessionsSum += sessions;
            uniqueModuleIds.push(moduleId);
        }
        presentCountSum += attendance.status === "Present" ? 1 : 0;
    });

    if (totalSessionsSum === 0 || presentCountSum === 0) {
        return 0;
    }

    return (presentCountSum / totalSessionsSum) * 100;
};
