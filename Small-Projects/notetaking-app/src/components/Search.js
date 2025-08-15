import React from "react";
import { MdSearch } from "react-icons/md";

const Search = ({handleSearchNote}) => {
    return (
        <div className="search">
            <MdSearch size="1.3em" className="search-icon" />
            <input
                type="text"
                placeholder="Search a note..."
               onChange={(event) => handleSearchNote(event.target.value)}
            />
        </div>
    );
};

export default Search;