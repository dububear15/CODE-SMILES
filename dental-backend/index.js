const express = require('express');
const cors = require('cors'); 
const db = require('./db');
const app = express();

app.use(cors()); 
app.use(express.json()); 

// --- PATIENT ROUTES ---
app.get('/list-patients', (req, res) => {
    const sqlQuery = "SELECT * FROM patients";
    db.query(sqlQuery, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/add-patient', (req, res) => {
    const { first_name, last_name, phone } = req.body;
    const sqlInsert = "INSERT INTO patients (first_name, last_name, phone) VALUES (?, ?, ?)";
    db.query(sqlInsert, [first_name, last_name, phone], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Patient added successfully!");
    });
});

app.delete('/delete-patient/:id', (req, res) => {
    const sqlDelete = "DELETE FROM patients WHERE patient_id = ?";
    db.query(sqlDelete, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Patient deleted successfully!");
    });
});

// --- APPOINTMENT ROUTES ---

// NEW: Availability Checker (The "Red/Green" Logic)
app.get('/check-availability/:date', (req, res) => {
    const date = req.params.date;
    // We select only the times for the requested date
    const sql = "SELECT appointment_time FROM appointments WHERE appointment_date = ?";
    
    db.query(sql, [date], (err, results) => {
        if (err) return res.status(500).send(err);
        // Returns a simple array of times like ["09:00:00", "14:30:00"]
        const bookedTimes = results.map(row => row.appointment_time);
        res.json(bookedTimes);
    });
});

app.get('/list-appointments', (req, res) => {
    const sql = `
        SELECT a.appointment_id, p.first_name, p.last_name, 
        DATE_FORMAT(a.appointment_date, '%Y-%m-%d') as appointment_date, 
        TIME_FORMAT(a.appointment_time, '%H:%i') as appointment_time, 
        a.treatment, a.patient_id
        FROM appointments a 
        JOIN patients p ON a.patient_id = p.patient_id 
        ORDER BY a.appointment_date ASC, a.appointment_time ASC`;
        
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

app.post('/add-appointment', (req, res) => {
    const { full_name, phone, email, treatment, appointment_date, appointment_time } = req.body;
    
    // Updated query to match your new form fields
    const query = `INSERT INTO appointments 
                   (patient_name, phone, email, treatment, appointment_date, appointment_time) 
                   VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(query, [full_name, phone, email, treatment, appointment_date, appointment_time], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database Error: Make sure your table has these columns!");
        }
        res.send("Appointment request submitted successfully!");
    });
});

app.put('/update-appointment/:id', (req, res) => {
    const { patient_id, appointment_date, appointment_time, treatment } = req.body;
    const sqlUpdate = "UPDATE appointments SET patient_id=?, appointment_date=?, appointment_time=?, treatment=? WHERE appointment_id=?";
    
    db.query(sqlUpdate, [patient_id, appointment_date, appointment_time, treatment, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Appointment updated successfully!");
    });
});

app.delete('/delete-appointment/:id', (req, res) => {
    const sqlDelete = "DELETE FROM appointments WHERE appointment_id = ?";
    db.query(sqlDelete, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send("Appointment cancelled successfully!");
    });
});

// --- START SERVER ---
// Always keep this at the very bottom
app.listen(3000, () => console.log(`Server running at http://localhost:3000`));