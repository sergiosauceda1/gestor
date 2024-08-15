const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let user = { username: "admin", password: "password" };
let tasks = [];

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: "Invalid credentials" });
    }
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { username: user.username, tasks: tasks });
});

app.get('/register-task', (req, res) => {
    res.render('register-task');
});

app.post('/add-task', (req, res) => {
    const { id, title, description, startDate, client, projectId, comments } = req.body;
    if (id && title && description && startDate && client && projectId) {
        tasks.push({ id, title, description, startDate, client, projectId, comments, status: "Por hacer" });
        res.redirect('/dashboard');
    } else {
        res.render('register-task', { error: "Todos los campos son requeridos" });
    }
});

app.get('/edit-task/:id', (req, res) => {
    const task = tasks.find(task => task.id === req.params.id);
    if (task) {
        res.render('edit-task', { task: task });
    } else {
        res.redirect('/dashboard');
    }
});

app.post('/update-task/:id', (req, res) => {
    const { status, newComment } = req.body;
    let task = tasks.find(task => task.id === req.params.id);
    if (task) {
        task.status = status;
        if (newComment) {
            const date = new Date().toLocaleString();
            task.comments = `${task.comments}\n${date}: ${newComment}`;
        }
        res.redirect('/dashboard');
    } else {
        res.redirect('/dashboard');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
