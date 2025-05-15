const express = require('express');
const path = require('path');
// const expressLayouts = require('express-ejs-layouts'); // Removed to avoid conflict
const app = express();
const ejsmate = require('ejs-mate'); // Ensure this is required
const port = 8080;
const method = require('method-override');

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(expressLayouts); // Removed to avoid conflict

// Set EJS as the templating engine and configure the layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set views directory
app.set('layout', 'layout/boilerplate');
app.engine('ejs', ejsmate);
app.use(method('_method')); // Use method-override middleware


app.get('/', (req, res) => {
    res.render('index');
})





// student data
const student = [
    {
        id: 1,
        name:"Zubir",
        last:"khan",
        age : 19
    },
    {
        id: 2,
        name:"Munir",
        last:"khan",
        age : 20
    },
    {
        id: 3,
        name:"Yahya",
        last:"khan",
        age : 20
    },
    {
        id: 4,
        name:"Jamil",
        last:"khan",
        age : 23
    }
]

app.get("/student/allStudents",(req,res)=>{
    res.render("student/allstudents",{students:student});
})

app.get("/student/create", (req, res) => {
    res.render("student/create", { student });
});

app.post("/student/create", (req, res) => {
    const { id, name, last, age } = req.body;
    const newStudent = {
        id: id,
        name: name,
        last: last,
        age: age
    };
    student.push(newStudent);
    res.redirect("/student/create"); // Redirect to GET route after adding student
});

app.get("/student/attendance", (req, res) => {
    res.render("student/attendance", { students: student });
});

app.get("/student/gradesReports", (req, res) => {
    res.render("student/gradesReports", { students: student });
});

// student data end

// teacher data
const teacher = [
    {
        id: 1,
        name:"Zubir",
        last:"khan",
        age : 30,
        subject: "Mathematics"
    },
    {
        id: 2,
        name:"Munir",
        last:"khan",
        age : 40,
        subject: "Physics"
    },
    {
        id: 3,
        name:"Yahya",
        last:"khan",
        age : 50,
        subject: "Chemistry"
    },
    {
        id: 4,
        name:"Jamil",
        last:"khan",
        age : 60,
        subject: "Biology"
    }   
]

app.get("/teacher/allTeachers", (req, res) => {
    res.render("teacher/allTeachers", { teachers: teacher });
});

app.get("/teacher/addTeacher", (req, res) => {
    res.render("teacher/addTeacher");
});

app.post("/teacher/addTeacher", (req, res) => {
    const { id, name, last, age, subject } = req.body;
    const newTeacher = {
        id: id,
        name: name,
        last: last,
        age: age,
        subject: subject
    };
    teacher.push(newTeacher);
    res.redirect("/teacher/allTeachers");
});

app.get("/teacher/attendance", (req, res) => {
    res.render("teacher/attendance", { teachers: teacher });
});

app.get("/teacher/classAssignments", (req, res) => {
    res.render("teacher/classAssignments", { teachers: teacher });
});

app.get("/teacher/schedules", (req, res) => {
    res.render("teacher/schedules", { teachers: teacher });
});

app.get("/teacher/reports", (req, res) => {
    res.render("teacher/reports", { teachers: teacher });
});
// teacher data end

// classes data
const classes = [
    { id: 1, name: "Class 1", teacher: "Zubir Khan", room: "101" },
    { id: 2, name: "Class 2", teacher: "Munir Khan", room: "102" },
    { id: 3, name: "Class 3", teacher: "Yahya Khan", room: "103" },
    { id: 4, name: "Class 4", teacher: "Jamil Khan", room: "104" }
];

app.get("/classes/allClasses", (req, res) => {
    res.render("classes/allClasses", { classes });
});

app.get("/classes/addClass", (req, res) => {
    res.render("classes/addClass");
});

app.post("/classes/addClass", (req, res) => {
    const { id, name, teacher, room } = req.body;
    const newClass = { id, name, teacher, room };
    classes.push(newClass);
    res.redirect("/classes/allClasses");
});

app.get("/classes/classTimetable", (req, res) => {
    res.render("classes/classTimetable");
});

// subjects data
const subjects = [
    { id: 1, name: "Mathematics", assignedClass: "Class 1" },
    { id: 2, name: "Physics", assignedClass: "Class 2" },
    { id: 3, name: "Chemistry", assignedClass: "Class 3" },
    { id: 4, name: "Biology", assignedClass: "Class 1" }
];

app.get("/subjects/allSubjects", (req, res) => {
    res.render("subjects/allSubjects", { subjects });
});

app.get("/subjects/assignToClass", (req, res) => {
    res.render("subjects/assignToClass");
});

app.post("/subjects/assignToClass", (req, res) => {
    const { subject, class: className } = req.body;
    const newSubject = { id: subjects.length + 1, name: subject, assignedClass: className };
    subjects.push(newSubject);
    res.redirect("/subjects/allSubjects");
});

// exams data
const exams = [
    { id: 1, subject: "Mathematics", date: "2024-07-01", time: "09:00 AM" },
    { id: 2, subject: "Physics", date: "2024-07-02", time: "10:00 AM" },
    { id: 3, subject: "Chemistry", date: "2024-07-03", time: "11:00 AM" },
    { id: 4, subject: "Mathematics", date: "2024-07-04", time: "12:00 PM" }
];

app.get("/exams/examSchedule", (req, res) => {
    res.render("exams/examSchedule", { exams });
});

app.get("/exams/marksEntry", (req, res) => {
    res.render("exams/marksEntry");
});

app.post("/exams/marksEntry", (req, res) => {
    const { studentId, subject, marks } = req.body;
    const newMark = { studentId, subject, marks };
    marksEntries.push(newMark);
    res.redirect("/exams/marksEntry");
});

// report cards data
const reportCards = [
    { studentId: 1, name: "Zubir Khan", subject: "Mathematics", marks: 85, grade: "A" },
    { studentId: 2, name: "Munir Khan", subject: "Physics", marks: 78, grade: "B" },
    { studentId: 3, name: "Yahya Khan", subject: "Chemistry", marks: 92, grade: "A" },
    { studentId: 4, name: "Jamil Khan", subject: "Biology", marks: 88, grade: "A" }
];

app.get("/exams/reportCards", (req, res) => {
    res.render("exams/reportCards", { reportCards });
});

// fees data
const feesReports = [
    { studentId: 1, name: "Zubir Khan", amount: 500, date: "2024-06-01" },
    { studentId: 2, name: "Munir Khan", amount: 450, date: "2024-06-05" },
    { studentId: 3, name: "Yahya Khan", amount: 600, date: "2024-06-10" },
    { studentId: 4, name: "Jamil Khan", amount: 550, date: "2024-06-15" }
];

app.get("/fees/collectFees", (req, res) => {
    res.render("fees/collectFees");
});

app.post("/fees/collectFees", (req, res) => {
    const { studentId, amount } = req.body;
    const newFee = { studentId, amount, date: new Date().toISOString().split('T')[0] };
    feesReports.push(newFee);
    res.redirect("/fees/collectFees");
});

app.get("/fees/feesReport", (req, res) => {
    res.render("fees/feesReport", { feesReports });
});

// library data
const books = [
    { id: 1, title: "Mathematics 101", author: "John Doe", copies: 5 },
    { id: 2, title: "Physics Fundamentals", author: "Jane Smith", copies: 3 },
    { id: 3, title: "Chemistry Basics", author: "Albert Johnson", copies: 4 },
    { id: 4, title: "Biology Essentials", author: "Mary Brown", copies: 2 }
];

const issuedBooks = [];

app.get("/library/booksList", (req, res) => {
    res.render("library/booksList", { books });
});

app.get("/library/issueReturn", (req, res) => {
    res.render("library/issueReturn");
});

app.post("/library/issueReturn", (req, res) => {
    const { bookId, studentId, action } = req.body;
    if (action === "issue") {
        issuedBooks.push({ bookId, studentId, date: new Date().toISOString().split('T')[0] });
        const book = books.find(b => b.id == bookId);
        if (book) book.copies = Math.max(0, book.copies - 1);
    } else if (action === "return") {
        const index = issuedBooks.findIndex(ib => ib.bookId == bookId && ib.studentId == studentId);
        if (index !== -1) {
            issuedBooks.splice(index, 1);
            const book = books.find(b => b.id == bookId);
            if (book) book.copies += 1;
        }
    }
    res.redirect("/library/issueReturn");
});

// events data
const notices = [
    { id: 1, title: "School Closed", date: "2024-06-15", content: "School will be closed for summer break." },
    { id: 2, title: "Parent-Teacher Meeting", date: "2024-06-20", content: "Meeting scheduled in the auditorium." },
    { id: 3, title: "Exam Schedule", date: "2024-06-25", content: "Exams will start from June 25th." },
    { id: 4, title: "Sports Day", date: "2024-07-01", content: "Annual sports day will be held on July 1st." }
];

app.get("/events/noticeBoard", (req, res) => {
    res.render("events/noticeBoard", { notices });
});

app.get("/events/calendar", (req, res) => {
    res.render("events/calendar");
});

// users data
const admins = [
    { id: 1, name: "Admin One", email: "admin1@example.com" },
    { id: 2, name: "Admin Two", email: "admin2@example.com" },
];

const staffs = [
    { id: 1, name: "Staff One", position: "Clerk" },
    { id: 2, name: "Staff Two", position: "Accountant" },
    { id: 3, name: "Staff Three", position: "Librarian" },
    { id: 4, name: "Staff Four", position: "Security" },
    { id: 5, name: "Staff Five", position: "Janitor" }
];

const parents = [
    { id: 1, name: "Parent One", childName: "Zubir Khan", contact: "123-456-7890" },
    { id: 2, name: "Parent Two", childName: "Munir Khan", contact: "987-654-3210" },
    { id: 3, name: "Parent Three", childName: "Yahya Khan", contact: "555-555-5555" },
    { id: 4, name: "Parent Four", childName: "Jamil Khan", contact: "444-444-4444" }
];

app.get("/users/admins", (req, res) => {
    res.render("users/admins", { admins });
});

app.get("/users/staff", (req, res) => {
    res.render("users/staff", { staffs });
});

app.get("/users/parents", (req, res) => {
    res.render("users/parents", { parents });
});

// transportation data
const routes = [
    { id: 1, name: "Route 1", stops: ["Stop A", "Stop B", "Stop C"] },
    { id: 2, name: "Route 2", stops: ["Stop D", "Stop E", "Stop F"] },
    { id: 3, name: "Route 3", stops: ["Stop G", "Stop H", "Stop I"] },
    { id: 4, name: "Route 4", stops: ["Stop J", "Stop K", "Stop L"] }
];

const vehicles = [
    { id: 1, type: "Bus", driver: "Driver One", capacity: 40 },
    { id: 2, type: "Van", driver: "Driver Two", capacity: 15 },
    { id: 3, type: "SUV", driver: "Driver Three", capacity: 7 },
    { id: 4, type: "Truck", driver: "Driver Four", capacity: 2 }
];

app.get("/transportation/routes", (req, res) => {
    res.render("transportation/routes", { routes });
});

app.get("/transportation/vehicles", (req, res) => {
    res.render("transportation/vehicles", { vehicles });
});

// mySection data
const user = {
    name: "Yahya",
    last: "Khan",
    email: "yahya.khan@example.com",
    role: "Teacher"
};

app.get("/mySection/profile", (req, res) => {
    res.render("mySection/profile", { user });
});

app.get("/mySection/settings", (req, res) => {
    res.render("mySection/settings");
});
