import { useState } from 'react'
import css from './App.module.css'
import { useQuery } from '@tanstack/react-query'
import { fetchNotes } from '../../services/noteService'
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search], 
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
    placeholderData: (previousData) => previousData,
  })

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        
        {data && data.totalPages > 1 && (
          <Pagination 
            totalPages={data.totalPages} 
            currentPage={page} 
            onPageChange={setPage} 
          />
        )}
        
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading && <p className={css.status}>Завантаження нотаток...</p>}
        {isError && <p className={css.error}>Сталася помилка при завантаженні нотаток.</p>}
        
        {data && (
          <NoteList notes={data.notes} />
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  )
}

export default App;