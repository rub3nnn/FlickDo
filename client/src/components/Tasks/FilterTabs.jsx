import React, { useState, useMemo } from "react";
import { FilterButton } from "./FilterButton";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";

export const FilterTabs = ({ options = [], active, onChange }) => {
  const [open, setOpen] = useState(false);

  // Choose up to N chips to show; prioritize active, then by count desc
  const CHIPS_MAX = 4;
  const chips = useMemo(() => {
    if (!options || options.length === 0) return [];

    const activeItem = options.find((o) => o.id === active);
    // sort by count desc
    const byCount = [...options].sort(
      (a, b) => (b.count || 0) - (a.count || 0)
    );

    const results = [];
    if (activeItem) results.push(activeItem);

    for (const o of byCount) {
      if (results.length >= CHIPS_MAX) break;
      if (results.find((r) => r.id === o.id)) continue;
      results.push(o);
    }

    // ensure stable order: active first, then others by count
    return results;
  }, [options, active]);

  // Options that are not shown as chips
  const hiddenOptions = useMemo(() => {
    const ids = new Set(chips.map((c) => c.id));
    return options.filter((o) => !ids.has(o.id));
  }, [options, chips]);

  return (
    <div className="filter-tabs-wrapper" style={{ alignItems: "center" }}>
      <div style={{ marginRight: 8 }}>
        {hiddenOptions.length > 0 && (
          <>
            <button
              className="filter-button more-button"
              onClick={() => setOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-label={`Abrir otras listas (${hiddenOptions.length})`}
            >
              <span className="filter-label">Otras</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"
                />
              </svg>
            </button>

            <CommandDialog
              open={open}
              onOpenChange={setOpen}
              title="Otras listas"
              description="Selecciona una lista"
            >
              <CommandInput placeholder="Buscar listas..." />
              <CommandList>
                {hiddenOptions.length === 0 && (
                  <CommandEmpty>No hay listas</CommandEmpty>
                )}
                <CommandGroup>
                  {hiddenOptions.map((o) => (
                    <CommandItem
                      key={o.id}
                      onSelect={() => {
                        onChange(o.id);
                        setOpen(false);
                      }}
                    >
                      {o.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>
          </>
        )}
      </div>
      <div className="filter-chips" style={{ display: "flex", gap: 8 }}>
        {chips.map((c) => (
          <FilterButton
            key={c.id}
            id={c.id}
            label={c.label}
            count={c.count}
            active={active === c.id}
            onClick={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;
