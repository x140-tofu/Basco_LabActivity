const API_URL = 'https://jsonplaceholder.typicode.com/todos';

const appTitle = document.getElementById('app-title');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-title');
const taskCategoryInput = document.getElementById('task-category');
const taskDateInput = document.getElementById('task-date');
const taskIdInput = document.getElementById('task-id');
const taskList = document.getElementById('task-list');
const submitBtn = document.getElementById('submit-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const statusMessage = document.getElementById('status-message');

let localTasks = [];

function setLoading(isLoading) {
    if (isLoading) {
        loadingSpinner.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        loadingSpinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

function showMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
    setTimeout(() => {
        statusMessage.className = 'hidden';
    }, 3000);
}

function saveToLocalStorage() {
    localStorage.setItem('lab_tasks', JSON.stringify(localTasks));
    localStorage.setItem('app_title', appTitle.textContent);
}

const savedTitle = localStorage.getItem('app_title');
if (savedTitle) {
    appTitle.textContent = savedTitle;
}

appTitle.addEventListener('blur', () => {
    if (appTitle.textContent.trim() === '') {
        appTitle.textContent = 'Task Manager (CRUD Lab)';
    }
    saveToLocalStorage();
});

// 1. READ (GET)
async function fetchTasks() {
    const savedTasks = localStorage.getItem('lab_tasks');
    if (savedTasks) {
        localTasks = JSON.parse(savedTasks);
        renderTasks();
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(`${API_URL}?_limit=5`);
        if (!response.ok) throw new Error('Failed to fetch tasks from the server.');
        
        const serverTasks = await response.json();
        localTasks = serverTasks.map(task => ({
            ...task,
            category: 'General',
            dueDate: new Date().toISOString().split('T')[0]
        }));

        saveToLocalStorage();
        renderTasks();
        showMessage('Tasks loaded successfully!', 'success');
    } catch (error) {
        showMessage(error.message, 'error');
    } finally {
        setLoading(false);
    }
}

function renderTasks() {
    taskList.innerHTML = '';

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    localTasks.forEach(task => {
        const isDueToday = task.dueDate === todayStr;
        const isDueTomorrow = task.dueDate === tomorrowStr;

        const li = document.createElement('li');
        if (isDueToday) {
            li.className = 'due-today';
        } else if (isDueTomorrow) {
            li.className = 'due-tomorrow';
        } else {
            li.className = '';
        }

        li.innerHTML = `
            <div class="task-info">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    onchange="toggleTaskStatus(${task.id}, this.checked)">
                <div class="task-details">
                    <div>
                        <span class="category-badge">${task.category || 'General'}</span>
                        <span class="task-title-text ${task.completed ? 'completed' : ''}">${task.title}</span>
                    </div>
                    <span class="task-date-label ${isDueToday ? 'due-today-text' : ''} ${isDueTomorrow ? 'due-tomorrow-text' : ''}">
                        Due: ${task.dueDate || 'No date'} 
                        ${isDueToday ? '(Today!)' : isDueTomorrow ? '(Tomorrow!)' : ''}
                    </span>
                </div>
            </div>
            <div class="actions">
                <button onclick="prepareEdit(${task.id}, '${task.title.replace(/'/g, "\\'")}', '${task.category || 'Personal'}', '${task.dueDate || ''}')">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    const category = taskCategoryInput.value;
    const dueDate = taskDateInput.value;
    const id = taskIdInput.value;

    if (!title || !dueDate) return;

    if (id) {
        await updateTask(Number(id), title, category, dueDate);
    } else {
        await createTask(title, category, dueDate);
    }
});

// 2. CREATE (POST)
async function createTask(title, category, dueDate) {
    setLoading(true);
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ title, completed: false, category, dueDate })
        });

        const newTask = {
            id: Date.now(),
            title: title,
            completed: false,
            category: category,
            dueDate: dueDate
        };
        
        localTasks.unshift(newTask);
        saveToLocalStorage();
        renderTasks();
        
        taskForm.reset();
        showMessage('Task added successfully!', 'success');
    } catch (error) {
        showMessage('Failed to create task.', 'error');
    } finally {
        setLoading(false);
    }
}

window.prepareEdit = function(id, title, category, dueDate) {
    taskIdInput.value = id;
    taskInput.value = title;
    taskCategoryInput.value = category;
    taskDateInput.value = dueDate;
    submitBtn.textContent = 'Update Task';
}

// UPDATE (PUT)
async function updateTask(id, title, category, dueDate) {
    setLoading(true);
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({ id, title, completed: false, category, dueDate })
        });

        localTasks = localTasks.map(task => task.id === id ? { ...task, title, category, dueDate } : task);
        saveToLocalStorage();
        renderTasks();

        taskForm.reset();
        taskIdInput.value = '';
        submitBtn.textContent = 'Add Task';
        showMessage('Task updated successfully!', 'success');
    } catch (error) {
        showMessage('Failed to update task.', 'error');
    } finally {
        setLoading(false);
    }
}

// TOGGLE CHECKLIST STATUS (PATCH)
window.toggleTaskStatus = async function(id, isCompleted) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json; charset=Str' },
            body: JSON.stringify({ completed: isCompleted })
        });

        localTasks = localTasks.map(task => task.id === id ? { ...task, completed: isCompleted } : task);
        saveToLocalStorage();
        renderTasks();
        showMessage('Task status updated!', 'success');
    } catch (error) {
        localTasks = localTasks.map(task => task.id === id ? { ...task, completed: isCompleted } : task);
        saveToLocalStorage();
        renderTasks();
        showMessage('Task status updated!', 'success');
    }
}

// 3. DELETE (DELETE)
window.deleteTask = async function(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        localTasks = localTasks.filter(task => task.id !== id);
        saveToLocalStorage();
        renderTasks();

        showMessage('Task deleted successfully!', 'success');
    } catch (error) {
        showMessage('Failed to delete task.', 'error');
    } finally {
        setLoading(false);
    }
}

fetchTasks();