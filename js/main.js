


$(document).ready(function () {
   
    loadTodos();

    
    $('#todoForm').submit(function (event) {
        event.preventDefault();
        const todoText = $('#todoInput').val();
        if (todoText.trim() !== '') {
            addTodo({
                text: todoText,
                completed: false
            });
            $('#todoInput').val('');
        }
    });

    
    $('#todoList').on('click', 'li', function () {
        const todoId = $(this).data('id');
        toggleTodoStatus(todoId);
    });

    
    $('#todoList').on('click', 'button.delete', function (event) {
        event.stopPropagation(); 
        const todoId = $(this).closest('li').data('id');
        deleteTodo(todoId);
    });

    
    $('#filterButtons').on('click', 'button', function () {
        const status = $(this).data('status');
        filterTodos(status);
    });

    
    function loadTodos() {
        $.ajax({
            url: 'http://localhost:3000/todos',
            method: 'GET',
            success: function (data) {
                displayTodos(data);
            }
        });
    }

    
    function addTodo(todo) {
        $.ajax({
            url: 'http://localhost:3000/todos',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(todo),
            success: function () {
                loadTodos();
            }
        });
    }

    
    function toggleTodoStatus(todoId) {
        $.ajax({
            url: `http://localhost:3000/todos/${todoId}`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({ completed: true }),
            success: function () {
                loadTodos();
            }
        });
    }

    
    function deleteTodo(todoId) {
        $.ajax({
            url: `http://localhost:3000/todos/${todoId}`,
            method: 'DELETE',
            success: function () {
                loadTodos();
            }
        });
    }

    
    function displayTodos(todos) {
        $('#todoList').empty();
        todos.forEach(function (todo) {
            const statusClass = todo.completed ? 'completed' : '';
            $('#todoList').append(`
          <li class="${statusClass}" data-id="${todo.id}">
            ${todo.text}
            <button class="delete">Delete</button>
          </li>
        `);
        });
    }

    
    function filterTodos(status) {
        $.ajax({
            url: `http://localhost:3000/todos?completed=${status}`,
            method: 'GET',
            success: function (data) {
                displayTodos(data);
            }
        });
    }
});
