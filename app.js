const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const app = express();
const Todo = require('./static/js/models/db.js');

mongoose.connect('mongodb://localhost:27017/TodoApplication');

app.use('/static', express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
})

// put routes here

app.get('/api/todos', async (request, response) => {
    let pulledTodos = await Todo.find();
    return response.json(pulledTodos);
})

app.post('/api/todos', async (request, response) => {
    let instance = request.body;
    let newTodo = new Todo({
        title: instance.title,
        completed: false
    });

    console.log(newTodo);

    newTodo.save().then((newTodo) => {
        return response.json(newTodo);
    });
});

app.put('/api/todos/:id', async (request, response) => {
    let id = request.params.id;
    let title = request.body.title;

    if (request.body.completed) {
        await Todo.find({ _id: id })
        .update({completed: true});
    }
    else {
        await Todo.find({ _id: id})
        .update({title: title})
        .then((todo) => {
            return response.json(todo);
            }
        )}
});

app.delete('/api/todos/:id', async (request, response) => {
    let id = request.params.id;
    let title = request.body.title;
        await Todo.find({ _id: id})
        .remove()
        .then((todo) => {
            return response.json(todo);
        });
    }
);

app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
