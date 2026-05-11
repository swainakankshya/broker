import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ContextMenu = ({
  open,
  x,
  y,
  items,
  onClose,
  onAction,
}) => {
  const ref = useRef(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // Reset filter when menu opens
  useEffect(() => {
    if (open) setFilterText("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="context-menu"
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 9999,
      }}
    >
      {/* FILTER INPUT */}
      <div className="context-filter">
        <span className="context-filter-label">Filter For:</span>
<input
  type="text"
  autoFocus
  value={filterText}
  className="context-filter-input"

  onChange={(e) => setFilterText(e.target.value)}

 onKeyDown={(e) => {
  if (e.key === "Enter") {
    onAction?.("filterText", filterText);
  }
}}
/>

        {filterText && (
        <button
  type="button"
  className="context-filter-clear"
  title="Clear filter"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    setFilterText("");

    // Correct action for remove filter
    onAction?.("remove", "", "");
  }}
>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
      </div>

      <div className="context-separator" />

      {/* MENU ITEMS */}
      {items.map((item, i) =>
        item.separator ? (
          <div key={i} className="context-separator" />
        ) : (
          <button
            key={i}
            className="context-item"
            type="button"
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            {item.icon && (
              <FontAwesomeIcon
                icon={item.icon}
                className="context-item-icon"
              />
            )}
            <span>{item.label}</span>
          </button>
        )
      )}
    </div>
  );
};

export default ContextMenu;
