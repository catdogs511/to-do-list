const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

window.onload = () => {
  loadTasks();
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }
};

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const taskItem = createTaskElement(taskText);
  taskList.appendChild(taskItem);
  saveTasks();
  taskInput.value = '';
}

function createTaskElement(text, completed = false) {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  li.innerHTML = `
    <span onclick="toggleComplete(this)" ondblclick="editTask(this)">${text}</span>
    <button onclick="removeTask(this)">Hapus</button>
  `;
  return li;
}

function toggleComplete(span) {
  const li = span.parentElement;
  li.classList.toggle('completed');
  saveTasks();
}

function removeTask(button) {
  button.parentElement.remove();
  saveTasks();
}

function editTask(span) {
  const newText = prompt("Edit tugas:", span.innerText);
  if (newText !== null && newText.trim() !== '') {
    span.innerText = newText.trim();
    saveTasks();
  }
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').innerText,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem('tasks')) || [];
  saved.forEach(task => {
    const li = createTaskElement(task.text, task.completed);
    taskList.appendChild(li);
  });
}

function filterTasks() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  document.querySelectorAll('#taskList li').forEach(li => {
    const text = li.querySelector('span').innerText.toLowerCase();
    li.style.display = text.includes(keyword) ? '' : 'none';
  });
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('✅ Service Worker Registered'))
    .catch(err => console.log('❌ Service Worker Error', err));
}
