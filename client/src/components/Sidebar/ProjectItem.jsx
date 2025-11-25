import { useNavigate, useLocation } from "react-router-dom";

export const ProjectItem = ({ id, name, count, color }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === `/list/${id}`;

  const handleClick = () => {
    navigate(`/list/${id}`);
  };

  return (
    <button
      className={`nav-item ${isActive ? "active" : ""}`}
      onClick={handleClick}
    >
      <div className={`project-dot`} style={{ background: color }} />
      <span className="nav-label">{name}</span>
      <span className="project-count">{count}</span>
    </button>
  );
};
