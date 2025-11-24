import { Skeleton } from "@/components/ui/skeleton";

export const TasksListSkeleton = () => {
  return (
    <div className="tasks-column">
      <div className="tasks-header">
        <div className="tasks-title-wrapper">
          <div className="tasks-title-group">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-6 w-8 rounded-full ml-2" />
          </div>
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>

        <div className="filter-buttons">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
      </div>

      <div className="tasks-list">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="task-card">
            <div className="task-content">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <div className="task-details flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
