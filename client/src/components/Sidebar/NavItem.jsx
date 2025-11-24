export const NavItem = ({
  icon: Icon,
  label,
  badge,
  active,
  onClick,
  disabled,
}) => {
  return (
    <button
      className={`nav-item ${active ? "active" : ""} ${
        disabled ? "disabled" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="icon-sm" />
      <span className="nav-label">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="nav-badge">{badge}</span>
      )}
    </button>
  );
};
