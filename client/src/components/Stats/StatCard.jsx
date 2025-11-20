export const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  variant,
}) => {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-bg-circle" />
      <div className="stat-content">
        <div className="stat-header">
          <Icon className="icon-sm" />
          <span className="stat-label">{label}</span>
        </div>
        <p className="stat-value">{value}</p>
        <p className="stat-description">{description}</p>
      </div>
    </div>
  );
};
