import React, { useReducer, useState, useEffect } from 'react';
import './App.css'

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'REMOVE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        tasks: state.tasks.filter(task => task.categoryId !== action.payload),
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    default:
      return state;
  }
}

const initialState = {
  tasks: [
    { id: 1, name: 'Task 1', description: 'Description for Task 1', category: 1 },
    { id: 2, name: 'Task 2', description: 'Description for Task 2', category: 2 },
  ],
  categories: [
    { id: 1, name: 'Category 1' },
    { id: 2, name: 'Category 2' },
  ],
};

const TodoApp = () => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [newTask, setNewTask] = useState({ name: '', description: '', category: '' });

  const handleAddTask = () => {
    if (newTask.name && newTask.category) {
      dispatch({ type: 'ADD_TASK', payload: { ...newTask, id: Date.now() } });
      setNewTask({ name: '', description: '', category: '' });
    } else {
      alert('Please fill in both task name and category.');
    }
  };

const handleAddCategory = () => {
  if (newTask.category) {
    dispatch({ type: 'ADD_CATEGORY', payload: { id: Date.now(), name: newTask.category } });
    setNewTask({ ...newTask, category: '' });
  } else {
    alert('Please fill in the category name.');
  }
};

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('categories', JSON.stringify(state.categories));
  }, [state.tasks, state.categories]);

  return (
    <div className="container">
      <h1>Todo List</h1>
      <div className="form-group">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="input-field"
        />
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          className="select-field"
        >
          <option value="" disabled>Select Category</option>
          {state.categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button onClick={handleAddTask} className="button">Add Task</button>
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Category Name"
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          className="input-field"
        />
        <button onClick={handleAddCategory} className="button">Add Category</button>
      </div>
      <ul className="task-list">
        {state.tasks.map(task => (
          <li key={task.id} className="list-item">
            <strong>{task.name}</strong> - {task.description} ({state.categories.find(category => category.id === task.category)?.name})
            <button onClick={() => dispatch({ type: 'REMOVE_TASK', payload: task.id })} className="remove-button">Remove</button>
          </li>
        ))}
      </ul>
      <ul className="category-list">
        {state.categories.map(category => (
          <li key={category.id} className="list-item">
            {category.name}
            <button onClick={() => dispatch({ type: 'REMOVE_CATEGORY', payload: category.id })} className="remove-button">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );

};

export default TodoApp;
