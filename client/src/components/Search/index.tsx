import SearchIcon from '../../../public/assets/icons/search.svg';
import styles from './style.module.scss';

interface SearchProps {
  query: string;
  setQuery: (query: string) => void;
}

const Search = ({ query, setQuery }: SearchProps) => (
  <div className={styles.container}>
    <SearchIcon/>
    <input
      type="text"
      placeholder="Search Applicant"
      value={query}
      onChange={e => setQuery(e.target.value)}
      className={styles.searchBar}
    />
  </div>
);

export default Search;
