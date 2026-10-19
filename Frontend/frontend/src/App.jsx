import { useState } from 'react'
import './App.css'

function App() {
  const [task,setTask] = useState("");
  async function getTask(){
    const response = await fetch(API);
    const data = await response.json()
    setTask(data);
  }
  //display the task on page
  useEffect(()=>{
    getTask()

  })
  async function addTask(e){
    e.preventDefault();
    if(!title.trim()){
      alert("Title missing");
    }
    const response = fetch(API,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({title})

    })
  }
  if(!response.ok){
    alert("Failed to add task");
  }
  async function deleteTask(id){
    const response = await fetch(`${API}/${id}`,{
      method: "DELETE",
    });
    if(!response.ok){
      alert("Failed to delete")
      return;
    }
    const data = await response.json();
    setTask(data);
  }

  return (
    <>
      <h1>Task Manager</h1>
      <form onSubmit = {addTask}>
        <input type="text"
        placeholder="Task title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}/>
        <button type="submit">Add Task</button>
      </form>
      <h2>Task List</h2>
      <ul>
        {task.map((t)=>{return <li key={t.id}>{t.title}</li>})}
        <button onClick = {()=>deleteTask(t.id)}>
          Delete
        </button>
      </ul>
    </>
  )
}

export default App
