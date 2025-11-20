import React from "react";

export const FilterButton = ({ id, label, count, active, onClick }) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`filter-button ${active ? "active" : ""}`}
    >
      {label}
      <span className="filter-count">{count}</span>
    </button>
  );
};
