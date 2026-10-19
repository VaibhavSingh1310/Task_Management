import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://localhost:3000/api'

function App() {
  const [task, setTask] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Display the tasks on the page
  async function getTask() {
    try {
      const response = await fetch(`${API}/tasks`)

      if (!response.ok) {
        throw new Error('Failed to get tasks')
      }

      const data = await response.json()
      setTask(data)
    } catch (error) {
      console.error(error)
      alert('Failed to load tasks. Check that the backend is running.')
    }
  }

  useEffect(() => {
    getTask()
  }, [])

  // Add a task
  async function addTask(e) {
    e.preventDefault()

    if (
      !name.trim() ||
      !email.trim() ||
      !title.trim() ||
      !description.trim()
    ) {
      alert('Name, email, title and description are required')
      return
    }

    try {
      const response = await fetch(`${API}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          title,
          description
        })
      })

      if (!response.ok) {
        alert('Failed to add task')
        return
      }

      setTitle('')
      setDescription('')

      await getTask()
    } catch (error) {
      console.error(error)
      alert('Failed to add task. Check that the backend is running.')
    }
  }

  // Delete a task
  async function deleteTask(titleToDelete) {
    try {
      const response = await fetch(
        `${API}/tasks/${encodeURIComponent(titleToDelete)}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        alert('Failed to delete task')
        return
      }

      await getTask()
    } catch (error) {
      console.error(error)
      alert('Failed to delete task. Check that the backend is running.')
    }
  }

  return (
    <>
      <h1>Task Manager</h1>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="User name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="User email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      <h2>Task List</h2>

      <ul>
        {task.map((t) => (
          <li key={t._id}>
            {t.title} — {t.description} ({t.status})

            <button
              type="button"
              onClick={() => deleteTask(t.title)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App