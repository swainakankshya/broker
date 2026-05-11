import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

import FilterContextWrapper from "../invoice/FilterContextWrapper";

const PillDropdownWithContext = ({
  id,
  value,
  options = [],
  onSelect,
  onContextAction,
  fieldName,
  displayLimit,
  className = "",
}) => {
  return (
    <FilterContextWrapper
      onAction={(action, text) =>
        onContextAction?.(action, fieldName, text || value)
      }
    >
      <div
        className={`input-pill py-1 pr-1 pill-md flex items-center justify-between ${className}`}
        style={{ width: "100%" }}
      >
        <span
  className={`font-medium whitespace-nowrap overflow-hidden ${
    displayLimit ? "truncate" : ""
  }`}
  style={displayLimit ? { maxWidth: displayLimit } : {}}
  title={value}
>
  {value || "-"}
</span>

        <DropdownMenu id={id}>
          <DropdownMenuTrigger asChild>
            <span>
              <button
                type="button"
                className="btn-dw px-1"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <FontAwesomeIcon icon={faCaretDown} />
              </button>
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuSeparator />

            {options.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onSelect={() => onSelect(opt)}
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </FilterContextWrapper>
  );
};

export default PillDropdownWithContext;
