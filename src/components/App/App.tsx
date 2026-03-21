import { useState } from 'react'
import css from './App.module.css'
import { useQuery } from '@tanstack/react-query'
import { fetchNotes } from '../../services/noteService'
import { useDebouncedCallback } from 'use-debounce';

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {data, } = useQuery({
    queryKey: ['notes', page, search], 
    queryFn: () => fetchNotes({page, perPage: 12, search}),
    placeholderData: (previousData) => previousData,
  })

  const handleSearch = useDebouncedCallback((value) => {
    setSearch(value);
    setPage(1)
  } ,300)

  return (
    <>
    <div className={css.app}>
	<header className={css.toolbar}>
		{/* Компонент SearchBox */}
		{/* Пагінація */}
		{/* Кнопка створення нотатки */}
  </header>
</div>
</>
  )
}

export default App
