import React from "react";

export const FilterButton = ({
  id,
  label,
  count,
  active,
  onClick,
  icon: Icon,
}) => {
  return (
    <button
      onClick={() => onClick(id)}
      className={`filter-button ${active ? "active" : ""}`}
    >
      {Icon && <Icon className="icon-sm filter-icon" />}
      {label}
      <span className="filter-count">{count}</span>
    </button>
  );
};
