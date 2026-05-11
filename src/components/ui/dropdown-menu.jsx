import { createContext, useContext, useEffect, useRef } from "react";
import { DropdownControllerContext } from "./dropdown-controller";

const DropdownContext = createContext(null);

/* =========================
   DropdownMenu
========================= */
export function DropdownMenu({ children, id }) {
  const { activeId, setActiveId } = useContext(DropdownControllerContext);
  const open = activeId === id;
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setActiveId(null);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, setActiveId]);

  return (
    <DropdownContext.Provider value={{ open, setActiveId, id }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

/* =========================
   Trigger
========================= */
export function DropdownMenuTrigger({ children }) {
  const { open, setActiveId, id } = useContext(DropdownContext);

  return (
    <div
      className="inline-flex cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        setActiveId(open ? null : id);
      }}
    >
      {children}
    </div>
  );
}


/* =========================
   Content
========================= */
export function DropdownMenuContent({ children }) {
  const { open } = useContext(DropdownContext);
  if (!open) return null;

  return <div className="dropdown-content">{children}</div>;
}

/* =========================
   Label
========================= */
export function DropdownMenuLabel({ children }) {
  return <div className="dropdown-label">{children}</div>;
}

/* =========================
   Separator
========================= */
export function DropdownMenuSeparator() {
  return <div className="dropdown-separator" />;
}

/* =========================
   Item
========================= */
export function DropdownMenuItem({ children, onSelect }) {
  const { setActiveId } = useContext(DropdownContext);

  return (
    <div
      className="dropdown-item"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.();
        setActiveId(null);
      }}
    >
      {children}
    </div>
  );
}
