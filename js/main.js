// // $('.content-item')
// //     .on('click', ($this) => {
// //         console.log($this);
// //     })
// //     .css('background: grey; color: white; font-size: 30px;');

// // function $(selector) {
// //     const items = document.querySelectorAll(selector);


// //     const methods = {
// //         on(userEvent, handler) {
// //             items.forEach(item => {
// //                 item.addEventListener(userEvent, (e) =>{
// //                     handler(item, e);
// //                 });
// //             })

// //         return methods;
// //         },
// //         css(cssText) {
// //             items.forEach(item => {
// //                 item.style.cssText = cssText;
// //             });

// //             return methods;
// //         },
// //     };
// //     return methods;
// // }


// // // addHandler('content-item', 'click',() => {
// // //     console.log('click');
// // // });

// // // addCss('content-item', 'background: grey; color: white;');


// // // function addHandler(selector, userEvent, cbHandler) {
// // //     const items = getEls(selector);

// // //     items.forEach(item => {
// // //        item.addEventListener(userEvent, cbHandler);
// // //     });
// // // }

// // // function addCss(selector, cssText) {
// // //     const items = getEls(selector);

// // //     items.forEach(item => {
// // //         item.style.cssText = cssText;
// // //      });
// // // }

// // // function getEls(selector) {
// // //     return document.querySelectorAll(selector);
// // // }


// $(function($) {
//     $('.content-item').each((index, item) => {
//         console.log(item);
//     });

//     $('.box').append('<div class="box-item">create el</div>');

//     $('.content').click(($this) => {
//         $('.content').toggle('slow');
//     });
// }); 


$(document).ready(function () {
    // Загрузка списка задач при загрузке страницы
    loadTodos();

    // Обработка формы добавления задачи
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

    // Обработка клика по задаче (отметка как выполненная/невыполненная)
    $('#todoList').on('click', 'li', function () {
        const todoId = $(this).data('id');
        toggleTodoStatus(todoId);
    });

    // Обработка клика по кнопке удаления задачи
    $('#todoList').on('click', 'button.delete', function (event) {
        event.stopPropagation(); // Предотвращение переключения статуса при клике на кнопку
        const todoId = $(this).closest('li').data('id');
        deleteTodo(todoId);
    });

    // Обработка клика по кнопке фильтрации задач
    $('#filterButtons').on('click', 'button', function () {
        const status = $(this).data('status');
        filterTodos(status);
    });

    // Функция для загрузки задач из сервера
    function loadTodos() {
        $.ajax({
            url: 'http://localhost:3000/todos',
            method: 'GET',
            success: function (data) {
                displayTodos(data);
            }
        });
    }

    // Функция для добавления задачи на сервер
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

    // Функция для переключения статуса задачи на сервере
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

    // Функция для удаления задачи на сервере
    function deleteTodo(todoId) {
        $.ajax({
            url: `http://localhost:3000/todos/${todoId}`,
            method: 'DELETE',
            success: function () {
                loadTodos();
            }
        });
    }

    // Функция для отображения задач на странице
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

    // Функция для фильтрации задач по статусу
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
