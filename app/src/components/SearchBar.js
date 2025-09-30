import React from 'react';

const SearchBar = ({searchValues, setSearchValue}) => {
    return (
        <input
            type="text"
            value={searchValues}
            onChange={e => setSearchValue(e.target.value)}
            placeholder=""
        />
    );

};

export default SearchBar;