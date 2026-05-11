import { useState, useCallback } from "react";
import ContextMenu from "../ui/ContextMenu";
import {
  faFilter,
  faFilterCircleXmark,
  faSortUp,
  faSortDown,
  faMagnifyingGlass,
  faBroom,
} from "@fortawesome/free-solid-svg-icons";

const FilterContextWrapper = ({ children, onAction }) => {
  const [menu, setMenu] = useState({
    open: false,
    x: 0,
    y: 0,
  });

  const openMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setMenu({
      open: true,
      x: e.clientX,
      y: e.clientY,
    });
  }, []);

  const closeMenu = useCallback(() => {
    setMenu((p) => ({ ...p, open: false }));
  }, []);

  const items = [
    {
      label: "Filter By Selection",
      icon: faFilter,
      onClick: () => {
        onAction?.("filterBy");
        closeMenu();
      },
    },
    {
      label: "Filter Excluding Selection",
      icon: faFilterCircleXmark,
      onClick: () => {
        onAction?.("exclude");
        closeMenu();
      },
    },
    {
      label: "Remove Filter / Selection",
      icon: faBroom,
      onClick: () => {
        onAction?.("remove");
        closeMenu();
      },
    },
    { separator: true },
    {
      label: "Sort Ascending",
      icon: faSortUp,
      onClick: () => {
        onAction?.("asc");
        closeMenu();
      },
    },
    {
      label: "Sort Descending",
      icon: faSortDown,
      onClick: () => {
        onAction?.("desc");
        closeMenu();
      },
    },
    { separator: true },
    {
      label: "Find...",
      icon: faMagnifyingGlass,
      onClick: () => {
        onAction?.("find");
        closeMenu();
      },
    },
  ];

  return (
    <>
      <div
        onContextMenu={openMenu}
        style={{ display: "inline-block", width: "100%" }}
      >
        {children}
      </div>

     <ContextMenu
  open={menu.open}
  x={menu.x}
  y={menu.y}
  items={items}
  onClose={closeMenu}
  onAction={(action, text) => onAction(action, text)}
/>

    </>
  );
};

export default FilterContextWrapper;
