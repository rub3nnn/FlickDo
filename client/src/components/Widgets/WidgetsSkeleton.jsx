import { Skeleton } from "@/components/ui/skeleton";

export const WidgetsSkeleton = () => {
  return (
    <div className="sidebar-column">
      {/* Events Widget Skeleton */}
      <div className="widget events-widget">
        <div className="widget-header">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="events-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="event-card">
              <div className="event-time">
                <Skeleton className="h-5 w-8 mb-1" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="event-details">
                <Skeleton className="h-4 w-40 mb-2" />
                <div className="event-meta">
                  <div className="event-meta-item">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <span>•</span>
                  <div className="event-meta-item">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-16" />
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
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      {/* Classroom Widget Skeleton */}
      <div className="widget classroom-widget">
        <div className="widget-header">
          <div className="widget-title-group">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <div className="classroom-list">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="classroom-card">
              <Skeleton className="h-4 w-full mb-2" />
              <div className="classroom-task-footer">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-8" />
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
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="widget quick-actions">
        <div className="quick-actions-header">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="quick-actions-list">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="quick-action-button"
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
