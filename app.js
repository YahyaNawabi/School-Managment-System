// Full working app.js with MySQL integration for complete School Management System
const express = require('express');
const path = require('path');
const ejsmate = require('ejs-mate');
const session = require('express-session');
const methodOverride = require('method-override');
const mysql = require('mysql2');
const app = express();
const port = 8080;

app.engine('ejs', ejsmate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'school',
  password: 'yah123'
});
connection.connect(err => {
  if (err) console.error('DB error:', err);
  else console.log('Connected to MySQL');
});


app.get('/', (req, res) => res.render('index'));



// STUDENTS
app.get('/student/manage', (req, res) => {
  const sql = "SELECT * FROM students";
  connection.query(sql, (err, results) => {
    res.render('student/manage', { students: results });
  });
});

app.get('/student/allStudents', (req, res) => {
  const sql = "select * from students";
  connection.query(sql, (err, results) => {
    res.render('student/allStudents', { students: results });
  });
});

app.get('/student/attendance', (req, res) => {
  const studentSql = 'SELECT id, name, last FROM students';
  const attendanceSql = 'SELECT * FROM student_attendance WHERE attendance_date = CURDATE()';
  connection.query(studentSql, (err, results) => {
    connection.query(attendanceSql, (err2, attRows) => {
      const records = {};
      attRows.forEach(r => {
        records[r.student_id] = r.status === 'Present';
      });
      res.render('student/attendance', { student: results, attendanceRecords: records });
    });
  });
});

app.post('/student/attendance', (req, res) => {
  const presentIds = Array.isArray(req.body.attendance) ? req.body.attendance : [req.body.attendance];
  const deleteSql = 'DELETE FROM student_attendance WHERE attendance_date = CURDATE()';
  const insertSql = 'INSERT INTO student_attendance (student_id, attendance_date, status) VALUES (?, CURDATE(), ?)';
  connection.query(deleteSql, () => {
    presentIds.forEach(id => {
      connection.query(insertSql, [id, 'Present']);
    });
    res.redirect('/student/attendance');
  });
});

app.get('/student/gradesReports', (req, res) => {
  const sql = 'SELECT * FROM students';
  connection.query(sql, (err, results) => {
    res.render('student/gradesReports', { students: results });
  });
});

app.get('/student/create', (req, res) => { 
  res.render('student/create')
});
app.post('/student/create', (req, res) => {
  const { name, last, age, fathername, contactno, email, address, class_id, dob, gender } = req.body;
  const sql = `INSERT INTO students (name, last, age, fathername, contactno, email, address, class_id, dob, gender)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, last, age, fathername, contactno, email, address, class_id, dob, gender];
  connection.query(sql, values, () => {
    res.redirect('/student/manage');
  });
});

app.get('/student/edit/:id/', (req, res) => {
  const sql = 'SELECT * FROM students WHERE id = ?';
  connection.query(sql, [req.params.id], (err, results) => {
    res.render('student/edit', { student: results[0] });
  });
});
app.post('/student/edit/:id', (req, res) => {
  const { name, last, age, fathername, contactno, email, address, class_id, dob, gender } = req.body;
  const sql = `UPDATE students SET name=?, last=?, age=?, fathername=?, contactno=?, email=?, address=?, class_id=?, dob=?, gender=?
               WHERE id = ?`;
  const values = [name, last, age, fathername, contactno, email, address, class_id, dob, gender, req.params.id];
  connection.query(sql, values, () => {
    res.redirect('/student/manage');
  });
});

app.get('/student/manage', (req, res) => {
  const sql = 'SELECT * FROM students';
  connection.query(sql, (err, results) => {
    res.render('student/manage', { students: results });
  });
});

app.delete('/student/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id = ?';
  connection.query(sql, [id], () => {
    res.redirect('/student/manage');
  });
});

app.get('/student/show/:id/', (req, res) => {
  const sql = `
    SELECT s.*, c.name AS class_name
    FROM students s
    LEFT JOIN classes c ON s.class_id = c.id
    WHERE s.id = ?
  `;
  connection.query(sql, [req.params.id], (err, results) => {
    const student = results[0];
    if (student) {
      student.class = student.class_name;
    }
    res.render('student/show', { student });
  });
});


// TEACHERS
app.get('/teacher/allTeachers', (req, res) => {
  const sql = ` SELECT t.*, s.name AS subjectName FROM teachers t
    LEFT JOIN subjects s ON t.subject_id = s.id `;
  connection.query(sql, (err, teachers) => {
    res.render('teacher/allTeachers', { teachers });
  });
});

app.get('/teacher/addTeacher', (req, res) => {
  const sql = 'SELECT * FROM subjects';
  connection.query(sql, ( err, subjects) => {
    res.render('teacher/addTeacher', { subjects });
  });
});
app.post('/teacher/addTeacher', (req, res) => {
  const { name, last, age, subject_id, contactno, email } = req.body;
  const sql = ` INSERT INTO teachers (name, last, age, subject_id, contactno, email)
    VALUES (?, ?, ?, ?, ?, ?) `;
  const values = [name, last, age, subject_id, contactno, email];
  connection.query(sql, values, () => {
    res.redirect('/teacher/allTeachers');
  });
});


app.get('/teacher/attendance', (req, res) => {
  const teacherSql = 'SELECT id, name, last FROM teachers';
  const attendanceSql = 'SELECT * FROM teacher_attendance WHERE attendance_date = CURDATE()';
  connection.query(teacherSql, (__, tRows) => {
    connection.query(attendanceSql, (__, attRows) => {
      const records = {};
      attRows.forEach(record => {
        records[record.teacher_id] = record.status === 'Present';
      });
      res.render('teacher/attendance', {
        teachers: tRows,
        attendanceRecords: records
      });
    });
  });
});
app.post('/teacher/attendance', (req, res) => {
  const presentIds = Array.isArray(req.body.attendance)? req.body.attendance: [req.body.attendance];
  const deleteSql = 'DELETE FROM teacher_attendance WHERE attendance_date = CURDATE()';
  const insertSql = ` INSERT INTO teacher_attendance (teacher_id, attendance_date, status)
    VALUES (?, CURDATE(), 'Present') `;
  connection.query(deleteSql, () => {
    presentIds.forEach(id => {
      connection.query(insertSql, [id]);
    });
    res.redirect('/teacher/attendance');
  });
});

app.get('/teacher/classAssignments', (req, res) => {
  const sql = 'SELECT * FROM teachers';
  connection.query(sql, (err, teachers) => {
    res.render('teacher/classAssignments', { teachers });
  });
});

app.get('/teacher/reports', (req, res) => {
  const sql = 'SELECT * FROM teachers';
  connection.query(sql, (err, teachers) => {
    res.render('teacher/reports', { teachers });
  });
});

app.get('/teacher/schedules', (req, res) => {
  const sql = 'SELECT * FROM teachers';
  connection.query(sql, (err, teachers) => {
    res.render('teacher/schedules', { teachers });
  });
});


//Classes
app.get('/classes', (req, res) => {
  const sql = ` SELECT c.*, COALESCE(CONCAT(t.name, ' ', t.last), 'No Teacher') AS teacher_name
    FROM classes c LEFT JOIN teachers t ON c.teacher_id = t.id `;
  connection.query(sql, (__, rows) => {
    res.render('classes/allClasses', { classes: rows });
  });
});

app.get('/classes/allClasses', (req, res) => {
  const sql = ` SELECT c.*, COALESCE(CONCAT(t.name, ' ', t.last), 'No Teacher') AS teacher_name
    FROM classes c LEFT JOIN teachers t ON c.teacher_id = t.id `;
  connection.query(sql, (__, rows) => {
    res.render('classes/allClasses', { classes: rows });
  });
});

app.get('/classes/addClass', (req, res) => {
  connection.query('SELECT id, name, last FROM teachers', (__, teachers) => {
    res.render('classes/addClass', { teachers });
  });
});

app.post('/classes/addClass', (req, res) => {
  const { name, teacher_id, room } = req.body;
  const sql = ` INSERT INTO classes (name, teacher_id, room)
    VALUES (?, ?, ?) `;
  const values = [name, teacher_id || null, room];
  connection.query(sql, values, () => {
    res.redirect('/classes');
  });
});

app.get('/classes/classTimetable', (req, res) => {
  res.render('classes/classTimetable');
});


// subjects 
app.get('/subjects/allsubjects', (req, res) => {
  const sql = ` SELECT s.*, c.name AS assignedClass FROM subjects s
    LEFT JOIN classes c ON s.class_id = c.id `;
  connection.query(sql, (__, subjects) => {
    res.render('subjects/allSubjects', { subjects });
  });
});

app.get('/subjects/assignToClass', (req, res) => {
  const sqlSubjects = 'SELECT id, name FROM subjects';
  connection.query(sqlSubjects, (__, subjects) => {
    const sqlClasses = 'SELECT id, name FROM classes';
    connection.query(sqlClasses, (__, classes) => {
      res.render('subjects/assignToClass', { subjects, classes });
    });
  });
});
app.post('/subjects/assignToClass', (req, res) => {
  const { subject_id, class_id } = req.body;
  const sql = 'UPDATE subjects SET class_id = ? WHERE id = ?';
  connection.query(sql, [class_id, subject_id], () => {
    res.redirect('/subjects/allsubjects');
  });
});

app.get('/subjects/add', (req, res) => {
  connection.query('SELECT id, name FROM classes', (_, classes) => {
    res.render('subjects/add', { classes });
  });
});
app.post('/subjects/add', (req, res) => {
  const { name, class_id } = req.body;
  connection.query(
    'INSERT INTO subjects (name, class_id) VALUES (?, ?)',
    [name, class_id],
    () => res.redirect('/subjects/allsubjects')
  );
});


// EXAMS
app.get('/exams/examSchedule', (req, res) => {
  const sql = ` SELECT exams.id, subjects.name AS subject, exams.exam_date AS date, exams.exam_time AS time FROM exams
    JOIN subjects ON exams.subject_id = subjects.id `;
  connection.query(sql, (__, results) => {
    res.render('exams/examSchedule', { exams: results });
  });
});

app.get('/exams/addExam', (req, res) => {
  connection.query('SELECT id, name FROM subjects', (err, subjects) => {
    res.render('exams/addExam', { subjects });
  });
});
app.post('/exams/addExam', (req, res) => {
  const { subject_id, exam_date, exam_time } = req.body;
  const sql = `INSERT INTO exams (subject_id, exam_date, exam_time) VALUES (?, ?, ?)`;
  connection.query(sql, [subject_id, exam_date, exam_time], (err) => {
    res.redirect('/exams/examSchedule');
  });
});

app.get('/exams/marksEntry', (req, res) => {
  res.render('exams/marksEntry');
});

app.post('/exams/marksEntry', (req, res) => {
  const { studentId, subject, marks } = req.body;

  connection.query(
    `SELECT id FROM subjects WHERE name = ? LIMIT 1`,
    [subject],
    (__, subjectRows) => {
      if (!subjectRows.length) {
        return res.send('Invalid subject');
      }

      const subjectId = subjectRows[0].id;
      const grade = getGrade(marks);

      connection.query(
        `INSERT INTO marks (student_id, subject_id, marks, grade) VALUES (?, ?, ?, ?)`,
        [studentId, subjectId, marks, grade],
        () => {
          res.redirect('/exams/marksEntry');
        }
      );
    }
  );
});

app.get('/exams/reportCards', (req, res) => {
  const sql = `
    SELECT marks.student_id AS studentId,
           students.name,
           subjects.name AS subject,
           marks.marks,
           marks.grade
    FROM marks
    JOIN students ON marks.student_id = students.id
    JOIN subjects ON marks.subject_id = subjects.id
  `;
  connection.query(sql, (__, reportCards) => {
    res.render('exams/reportCards', { reportCards });
  });
});

// Grade Calculation Function
function getGrade(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
}


// FEES
app.get('/fees/collectFees', (req, res) => {
  res.render('fees/collectFees');
});
app.post('/fees/collectFees', (req, res) => {
  const { studentId, amount } = req.body;
  const payment_date = new Date();
  const sql = `INSERT INTO fees (student_id, amount, payment_date) VALUES (?, ?, ?)`;
  connection.query(sql, [studentId, amount, payment_date], () => {
    res.redirect('/fees/feesReport');
  });
});

app.get('/fees/feesReport', (req, res) => {
  const sql = ` SELECT fees.student_id AS studentId, students.name, fees.amount, fees.payment_date AS date FROM fees
    JOIN students ON fees.student_id = students.id
    ORDER BY fees.payment_date DESC `;
  connection.query(sql, (__, feesReports) => {
    res.render('fees/feesReport', { feesReports });
  });
});






// LIBRARY
app.get('/library/booksList', (req, res) => {
  const sqlGetBooks = 'SELECT * FROM books';
  connection.query(sqlGetBooks, (_, books) => {
    res.render('library/booksList', { books });
  });
});

app.get('/library/addBook', (req, res) => {
  res.render('library/addBook');
});
app.post('/library/addBook', (req, res) => {
  const { title, author, copies } = req.body;
  const sqlInsertBook = 'INSERT INTO books (title, author, copies) VALUES (?, ?, ?)';
  connection.query(sqlInsertBook, [title, author, copies], () => {
    res.redirect('/library/booksList');
  });
});

app.get('/library/issueReturn', (req, res) => {
  res.render('library/issueReturn');
});
app.post('/library/issueReturn', (req, res) => {
  const { bookId, studentId, action } = req.body;
  const sqlGetCopies = 'SELECT copies FROM books WHERE id = ?';
  const sqlInsertIssuedBook = 'INSERT INTO issued_books (book_id, student_id, issue_date, returned) VALUES (?, ?, ?, false)';
  const sqlDecreaseCopies = 'UPDATE books SET copies = copies - 1 WHERE id = ?';
  const sqlGetIssuedRecord = 'SELECT * FROM issued_books WHERE book_id = ? AND student_id = ? AND returned = false LIMIT 1';
  const sqlUpdateIssuedRecord = 'UPDATE issued_books SET returned = true, return_date = ? WHERE id = ?';
  const sqlIncreaseCopies = 'UPDATE books SET copies = copies + 1 WHERE id = ?';
  if (action === 'issue') {
    connection.query(sqlGetCopies, [bookId], (_, results) => {
      if (!results.length) return res.redirect('/library/booksList');
      if (results[0].copies < 1) return res.redirect('/library/booksList');
      const issueDate = new Date();
      connection.query(sqlInsertIssuedBook, [bookId, studentId, issueDate], () => {
        connection.query(sqlDecreaseCopies, [bookId], () => {
          res.redirect('/library/booksList');
        });
      });
    });
  } else if (action === 'return') {
    const returnDate = new Date();
    connection.query(sqlGetIssuedRecord, [bookId, studentId], (_, results) => {
      if (!results.length) return res.redirect('/library/booksList');
      const issuedId = results[0].id;
      connection.query(sqlUpdateIssuedRecord, [returnDate, issuedId], () => {
        connection.query(sqlIncreaseCopies, [bookId], () => {
          res.redirect('/library/booksList');
        });
      });
    });
  } else {
    res.redirect('/library/booksList');
  }
});

app.get('/library/issuedBooks', (req, res) => {
  const sqlIssuedBooks = `
    SELECT 
      issued_books.id,
      books.title,
      students.name AS studentName,
      issued_books.issue_date,
      issued_books.return_date,
      issued_books.returned
    FROM issued_books
    JOIN books ON issued_books.book_id = books.id
    JOIN students ON issued_books.student_id = students.id
    ORDER BY issued_books.issue_date DESC
  `;

  connection.query(sqlIssuedBooks, (_, results) => {
    res.render('library/issuedBooks', { issuedBooks: results });
  });
});








// NOTICES
app.get('/notices', (req, res) => {
  res.render('events/noticeBoard');
});
app.get('/events/noticeBoard', (req, res) => {
  res.render('events/noticeBoard');
});
app.get('/events/calendar', (req, res) => {
  res.render('events/calendar');
});

// TRANSPORTATION
app.get('/transportation/routes', (req, res) => {
  res.render('transportation/routes');
});
app.get('/transportation/vehicles', (req, res) => {
  res.render('transportation/vehicles');
});

// USER ROLES
app.get('/users/admins', (req, res) => {
  res.render('users/admins');
});
app.get('/users/parents', (req, res) => {
  res.render('users/parents');
});
app.get('/users/staff', (req, res) => {
  res.render('users/staff');
});

// SEARCH
app.get('/search', (req, res) => {
  res.render('searchResults');
});

// MY SECTION
app.get('/mySection/profile', (req, res) => {
  res.render('mySection/profile');
});
app.get('/mySection/settings', (req, res) => {
  res.render('mySection/settings');
});
app.get('/mySection/inbox', (req, res) => {
  res.render('mySection/inbox');
});
app.get('/logout', (req, res) => {
  // Implement logout logic here, for now redirect to home
  res.redirect('/');
});

// TEACHER ADDITIONAL ROUTES
app.get('/teacher/classAssignments', (req, res) => {
  res.render('teacher/classAssignments');
});
app.get('/teacher/schedules', (req, res) => {
  res.render('teacher/schedules');
});
app.get('/teacher/reports', (req, res) => {
  res.render('teacher/reports');
});

// STUDENT ADDITIONAL ROUTES
app.get('/student/fullinfo/:id', (req, res) => {
  connection.query('SELECT * FROM students WHERE id=?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).send('DB error');
    if (rows.length === 0) return res.status(404).send('Student not found');
    res.render('student/fullinfo', { student: rows[0] });
  });
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
