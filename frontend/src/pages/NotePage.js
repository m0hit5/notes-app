import React, { useState, useEffect } from 'react'
import { ReactComponent as ArrowLeft } from '../assets/arrow-left.svg'
import { Link } from 'react-router-dom'

const NotePage = ({ match, history }) => {
  let noteId = match.params.id
  const [note, setNote] = useState(null)

  useEffect(() => {
    getNote()
  }, [noteId])

  let getNote = async () => {
    if (noteId === 'new') return

    try {
      const response = await fetch(`/api/notes/${noteId}/`)
      const data = await response.json()
      setNote(data)
    } catch (error) {
      console.error('Error fetching note:', error)
    }
  }

  let createNote = async () => {
    try {
      await fetch(`/api/notes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      })
      refreshHomePage()
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  let updateNote = async () => {
    try {
      await fetch(`/api/notes/${noteId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      })
      refreshHomePage()
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  let deleteNote = async () => {
    try {
      await fetch(`/api/notes/${noteId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      refreshHomePage()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  let handleSubmit = () => {
    console.log('NOTE:', note)
    if (noteId !== 'new' && note.body === '') {
      deleteNote()
    } else if (noteId !== 'new') {
      updateNote()
    } else if (noteId === 'new' && note.body !== null) {
      createNote()
    }
  }

  let handleChange = (value) => {
    setNote((note) => ({ ...note, 'body': value }))
    console.log('Handle Change:', note)
  }

  let refreshHomePage = () => {
    history.push('/')
    window.location.reload() // Refresh the home page
  }

  return (
    <div className="note">
      <div className="note-header">
        <h3>
          <ArrowLeft onClick={handleSubmit} />
        </h3>
        {noteId !== 'new' ? (
          <button onClick={deleteNote}>Delete</button>
        ) : (
          <button onClick={handleSubmit}>Done</button>
        )}
      </div>
      <textarea onChange={(e) => { handleChange(e.target.value) }} value={note?.body}></textarea>
    </div>
  )
}

export default NotePage
