import { Skeleton } from "@/components/ui/skeleton";

export const WidgetsSkeleton = () => {
  return (
    <div className="sidebar-column">
      {/* Events Widget Skeleton */}
      <div className="widget events-widget">
        <div className="widget-header">
          <Skeleton className="widget-skeleton-title" />
          <Skeleton className="widget-skeleton-subtitle" />
        </div>
        <div className="events-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="event-card">
              <div className="event-time">
                <Skeleton className="widget-skeleton-time" />
                <Skeleton className="widget-skeleton-time-sm" />
              </div>
              <div className="event-details">
                <Skeleton className="widget-skeleton-text" />
                <div className="event-meta">
                  <div className="event-meta-item">
                    <Skeleton className="widget-skeleton-dot" />
                    <Skeleton className="widget-skeleton-label-sm" />
                  </div>
                  <span>•</span>
                  <div className="event-meta-item">
                    <Skeleton className="widget-skeleton-dot" />
                    <Skeleton className="widget-skeleton-label-md" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="widget-button"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton className="widget-skeleton-icon" />
          <Skeleton className="widget-skeleton-button-text" />
        </div>
      </div>

      {/* Classroom Widget Skeleton */}
      <div className="widget classroom-widget">
        <div className="widget-header">
          <div className="widget-title-group">
            <Skeleton className="widget-skeleton-icon-lg" />
            <Skeleton className="widget-skeleton-title-sm" />
          </div>
          <Skeleton className="widget-skeleton-badge" />
        </div>
        <div className="classroom-list">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="classroom-card">
              <Skeleton className="widget-skeleton-task" />
              <div className="classroom-task-footer">
                <Skeleton className="widget-skeleton-date" />
                <Skeleton className="widget-skeleton-count" />
              </div>
            </div>
          ))}
        </div>
        <div
          className="widget-button primary"
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton className="widget-skeleton-icon" />
          <Skeleton className="widget-skeleton-button-lg" />
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="widget quick-actions">
        <div className="quick-actions-header">
          <Skeleton className="widget-skeleton-action-icon" />
          <Skeleton className="widget-skeleton-action-text" />
        </div>
        <div className="quick-actions-list">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="quick-action-button"
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <Skeleton className="widget-skeleton-icon" />
              <Skeleton className="widget-skeleton-action-item" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
