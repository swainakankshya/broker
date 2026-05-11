import { createContext, useState } from "react";

export const DropdownControllerContext = createContext(null);

export function DropdownControllerProvider({ children }) {
  const [activeId, setActiveId] = useState(null);

  return (
    <DropdownControllerContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </DropdownControllerContext.Provider>
  );
}
