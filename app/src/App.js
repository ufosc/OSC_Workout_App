import React from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar.js'

function App() {
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <div className="App">

      {/* Search Bar Implementation */}
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <p>Search Results: {searchValue}</p>

      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
