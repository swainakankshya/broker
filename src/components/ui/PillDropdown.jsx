import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./dropdown-menu";

const PillDropdown = ({ id, value, options = [], onSelect, displayLimit }) => {
  return (
    <div className="input-pill py-1 pr-1 pill-md flex items-center justify-between">
     <span
  className={`font-medium ${displayLimit ? "truncate" : ""}`}
  style={displayLimit ? { maxWidth: displayLimit } : {}}
>
  {value || "-"}
</span>

      <DropdownMenu id={id}>
        <DropdownMenuTrigger asChild>
          <button type="button" className="btn-dw px-1">
            <FontAwesomeIcon icon={faCaretDown} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuSeparator />
          {options.map((opt, i) => (
            <DropdownMenuItem key={i} onSelect={() => onSelect(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PillDropdown;
