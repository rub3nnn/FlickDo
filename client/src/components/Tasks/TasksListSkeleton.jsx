import { Skeleton } from "@/components/ui/skeleton";

export const TasksListSkeleton = () => {
  return (
    <div className="tasks-column">
      <div className="tasks-header">
        <div className="tasks-title-wrapper">
          <div className="tasks-title-group">
            <Skeleton className="skeleton-title" />
            <Skeleton className="skeleton-count-badge" />
          </div>
          <Skeleton className="skeleton-add-btn" />
        </div>

        <div className="filter-buttons">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="skeleton-filter-btn" />
          ))}
        </div>
      </div>

      <div className="tasks-list">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="task-card">
            <div className="task-content">
              <Skeleton className="skeleton-task-checkbox" />
              <div className="skeleton-task-details">
                <Skeleton className="skeleton-task-title" />
                <div className="skeleton-task-meta">
                  <Skeleton className="skeleton-task-badge" />
                  <Skeleton className="skeleton-task-date" />
                </div>
              </div>
              <Skeleton className="skeleton-task-menu" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
