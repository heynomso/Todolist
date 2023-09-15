// Variables
const addTask = document.getElementById('add-task');
const taskContainer = document.getElementById('task-container');
const inputTask = document.getElementById('input-task');

// Function to create a new task element
function createTaskElement(taskData) {
  const task = document.createElement('div');
  task.classList.add('task');

  const li = document.createElement('li');
  li.innerText = taskData.title;
  task.appendChild(li);

  const checkButton = document.createElement('button');
  checkButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
  checkButton.classList.add('checkTask');
  task.appendChild(checkButton);

  const editButton = document.createElement('button');
  editButton.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
  editButton.classList.add('editTask');
  task.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add('deleteTask');
  task.appendChild(deleteButton);

  // Add event listeners for check, edit, and delete buttons
  checkButton.addEventListener('click', function () {
    if (li.style.textDecoration === 'line-through') {
      li.style.textDecoration = 'none';
      taskData.completed = false;
    } else {
      li.style.textDecoration = 'line-through';
      taskData.completed = true;
    }'line-through';
    fetch(`https://jsonplaceholder.typicode.com/todos/${taskData.id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed: true }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((updatedTaskData) => {
        taskData.completed = true;
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  });

  editButton.addEventListener('click', function () {
    const newTitleInput = document.createElement('input'); // Create an input field
    newTitleInput.type = 'text';
    newTitleInput.value = taskData.title;
    li.innerText = ''; // Clear the task title for input field
    li.appendChild(newTitleInput); // Add input field to the li

    // Event listener to save the edited task title
    newTitleInput.addEventListener('keyup', function (event) {
      if (event.key === 'Enter') {
        const newTitle = newTitleInput.value;
        li.innerText = newTitle; // Update the task title in the UI
        taskData.title = newTitle; // Update the task title in the data

        fetch(`https://jsonplaceholder.typicode.com/todos/${taskData.id}`, {
          method: 'PUT',
          body: JSON.stringify({ title: newTitle, completed: taskData.completed }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .catch((error) => {
            console.error('Error updating task:', error);
          });
      }
    });
  });

  deleteButton.addEventListener('click', function () {
    fetch(`https://jsonplaceholder.typicode.com/todos/${taskData.id}`, {
      method: 'DELETE',
    })
      .then(() => {
        task.remove();
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  });

  return task;
}

function addTaskHandler() {
  const taskTitle = inputTask.value.trim();
  if (taskTitle === '') {
    alert('Please Enter a Task');
  } else {
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify({ title: taskTitle, completed: false }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((newTaskData) => {
        const newTaskElement = createTaskElement(newTaskData);
        taskContainer.insertBefore(newTaskElement, taskContainer.firstChild);
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });

    inputTask.value = '';
  }
}

addTask.addEventListener('click', addTaskHandler);
inputTask.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    addTaskHandler();
  }
});

fetch('https://jsonplaceholder.typicode.com/todos')
  .then((response) => response.json())
  .then((tasks) => {
    tasks.forEach((taskData) => {
      const taskElement = createTaskElement(taskData);
      taskContainer.insertBefore(taskElement, taskContainer.firstChild);
    });
  })
  .catch((error) => {
    console.error('Error fetching tasks:', error);
  });
