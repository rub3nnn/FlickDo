export const ProjectItem = ({ name, count, color }) => {
  return (
    <button className="nav-item">
      <div className={`project-dot ${color}`} />
      <span className="nav-label">{name}</span>
      <span className="project-count">{count}</span>
    </button>
  );
};
