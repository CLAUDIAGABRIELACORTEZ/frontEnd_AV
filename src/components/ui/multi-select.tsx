// src/components/ui/multi-select.tsx
import React from "react";
import Select from "react-select";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  label?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const selected = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );

  const handleChange = (selectedOptions: any) => {
    const values = selectedOptions.map((opt: Option) => opt.value);
    onChange(values);
  };

  return (
    <div className="space-y-1">
      {label && <label className="block font-medium">{label}</label>}
      <Select
        isMulti
        options={options}
        value={selected}
        onChange={handleChange}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};
