import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowDown } from "react-icons/md";

function InputSelect({
  options,
  register,
  registerName,
  onOptionChange,
  defaultValue,
  style,
  styleArrow,
  object,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    defaultValue ?? options[0]
  );
  const selectRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onOptionChange) {
      if(object) onOptionChange(option, object);
      else onOptionChange(option);
    }
  };
  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={selectRef} className="w-full z-[500]">
      <div className="relative font-montserrat" onClick={handleToggle}>
        <input
          className={`border border-gray-300 rounded-md w-full text-start py-1 px-3 cursor-pointer  ${
            style ? style : null
          }`}
          value={selectedOption}
          {...(register
            ? { ...register(registerName ?? "type", { required: true }) }
            : "")}
          readOnly
        />
        <MdKeyboardArrowDown
          className={`absolute ${styleArrow ?? "inset-y-[20%]" } right-0 mr-1 cursor-pointer`}
          size="1.5em"
        />
      </div>

      <div className="w-full relative z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border font-montserrat bg-white absolute w-full"
            >
              {options.map((option) => (
                <motion.li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className="cursor-pointer hover:bg-[#718bf3] hover:text-white pl-3 py-1 rounded-sm"
                >
                  {option}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InputSelect;
