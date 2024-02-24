import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowDown, MdCancel } from "react-icons/md";

function InputSelect({
  options,
  register,
  registerName,
  onOptionChange,
  onOptionDelete,
  defaultValue,
  style,
  styleArrow,
  object,
  multiOption,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    defaultValue ?? options[0]
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filterOptions, setFilterOptions] = useState();
  const selectRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    if (multiOption) {
      const exists = selectedOptions.includes(option);
      if (!exists) setSelectedOptions((prev) => [...prev, option]);
    } else setSelectedOption(option);
    setIsOpen(false);
    if (onOptionChange) {
      if (object) onOptionChange(option, object);
      else onOptionChange(option);
    }
  };

  const handleDeleteSelect = (option) => {
    setFilterOptions(prev => [...prev, option]);
    setSelectedOptions(selectedOptions.filter(value => value !== option))
    if(onOptionDelete) onOptionDelete(option)
  }

  useEffect(() => {
    const deleteOption = options.filter(
      (value) => !selectedOptions.includes(value)
    );
    setFilterOptions(deleteOption);
  }, [selectedOptions]);

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if(multiOption && defaultValue){
      setSelectedOptions(defaultValue)
      setSelectedOption(selectedOptions.filter(value => !defaultValue.find(value)))
      setFilterOptions(options.filter(value => !selectedOptions.includes(value)))
    }
    
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={selectRef} className="w-full z-[500]" onClick={handleToggle}>
      <div className="relative font-montserrat">
        {multiOption ? (
          <article
            className={`flex flex-wrap gap-x-2 gap-y-1 border border-gray-300 rounded-md w-full text-start cursor-pointer  ${
              style ? style : null
            }`}
          >
            <AnimatePresence>
            {selectedOptions.map((option, i) => (
              <motion.section
              layout
                key={i}
                className="flex flex-row gap-1 items-center bg-gray-300 rounded-md text-gray-600 p-1 text-[0.75rem]"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
              >
                {option}
                <MdCancel color="gray" size="1.4em" className="rounded-full" onClick={() => handleDeleteSelect(option)}/>
              </motion.section>
            ))}
            </AnimatePresence>
          </article>
        ) : (
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
        )}
        <MdKeyboardArrowDown
          className={`absolute bg-white w-10 ${
            styleArrow ?? "inset-y-[20%]"
          } right-[1px] cursor-pointer`}
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
              className="border font-montserrat bg-white absolute w-full max-h-[300px] overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#a5a5a5 transparent",
              }}
            >
              {(filterOptions ?? options).map((option, i) => (
                <motion.li
                  key={i}
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
