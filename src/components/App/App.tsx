import { useState } from 'react'
import css from './App.module.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchNotes, createNote, deleteNote } from '../../services/noteService'
import type { CreateNoteParams } from '../../services/noteService'
import { useDebouncedCallback } from 'use-debounce';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';


function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const {data} = useQuery({
    queryKey: ['notes', page, search], 
    queryFn: () => fetchNotes({page, perPage: 12, search}),
    placeholderData: (previousData) => previousData,
  })

  const createMutation = useMutation({
    mutationFn: (newNote: CreateNoteParams) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notes']});
      setIsModalOpen(false);
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote (id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['notes']});
    }
  })

  const handleSearch = useDebouncedCallback((value) => {
    setSearch(value);
    setPage(1)
  } ,300);

  const handleDelete = (id: string) => {
    if(window.confirm("Delete this note?")){
      deleteMutation.mutate(id);
    }
  }

  return (
    <>
    <div className={css.app}>
	<header className={css.toolbar}>
		{/* Компонент SearchBox */}
    <SearchBox onChange={handleSearch}/>
    {data && data.totalPages > 1 && (
    <Pagination 
      totalPages={data.totalPages} 
      currentPage={page} 
      onPageChange={setPage} 
    />
  )}
		{/* Кнопка створення нотатки */}
    <button className={css.button} onClick={() => setIsModalOpen(true)}>Create note +</button>
  </header>

  <main>
        {data && (
          <NoteList notes={data.notes} onDelete={handleDelete} />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm 
            onSubmit={(values) => createMutation.mutate(values)} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
</div>
</>
  )
}

export default App
