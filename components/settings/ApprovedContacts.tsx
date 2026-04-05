'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'guardianeyeContacts'

function loadContacts(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveContacts(contacts: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
}

export default function ApprovedContacts() {
  const [contacts, setContacts] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setContacts(loadContacts())
    setHydrated(true)
  }, [])

  function addContact() {
    const name = input.trim()
    if (!name || contacts.includes(name)) return
    const updated = [...contacts, name]
    setContacts(updated)
    saveContacts(updated)
    setInput('')
  }

  function removeContact(name: string) {
    const updated = contacts.filter((c) => c !== name)
    setContacts(updated)
    saveContacts(updated)
  }

  if (!hydrated) return null

  return (
    <section>
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        Approved Contacts
      </h2>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
        Senders not on this list trigger a stranger-contact alert.
      </p>

      {/* Add contact */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addContact()}
          placeholder="Contact name"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        <button
          onClick={addContact}
          disabled={!input.trim()}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Add
        </button>
      </div>

      {/* Contact list */}
      {contacts.length === 0 ? (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
          No approved contacts yet — every sender will trigger a stranger-contact flag.
        </p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((name) => (
            <li
              key={name}
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/50"
            >
              <span className="text-sm text-zinc-800 dark:text-zinc-200">{name}</span>
              <button
                onClick={() => removeContact(name)}
                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
