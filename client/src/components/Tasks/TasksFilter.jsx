import React from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { List, CheckCircle2, Eye, EyeOff } from "lucide-react";

/**
 * Modern and responsive filter for task lists
 * Uses shadcn/ui Select component for better UX and accessibility
 */
export const TasksFilter = ({
  options = [],
  active,
  onChange,
  showCompleted = false,
  onToggleCompleted,
  completedCount = 0,
}) => {
  const { t } = useTranslation();

  // Find active option to display its count
  const activeOption = options.find((opt) => opt.id === active);
  const activeCount = activeOption?.count ?? 0;

  return (
    <div className="tasks-filter-container">
      <div className="filter-wrapper">
        <Select value={active} onValueChange={onChange}>
          <SelectTrigger className="filter-select-trigger">
            <div className="filter-select-content">
              <List className="filter-icon" size={16} />
              <SelectValue placeholder={t("tasks.selectList")} />
            </div>
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                <div className="filter-option-content">
                  <span className="filter-option-label">{option.label}</span>
                  <span className="filter-option-count">{option.count}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Toggle button for completed tasks */}
        <button
          className={`filter-count-badge ${showCompleted ? "active" : ""}`}
          onClick={onToggleCompleted}
          title={
            showCompleted ? t("tasks.hideCompleted") : t("tasks.showCompleted")
          }
        >
          {showCompleted ? (
            <>
              <EyeOff size={14} />
              <span>{completedCount}</span>
            </>
          ) : (
            <>
              <Eye size={14} />
              <span>{completedCount}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
