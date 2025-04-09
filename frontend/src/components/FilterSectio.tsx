"use client";
import React from "react";
import { Accordion, Stack, Box } from "@chakra-ui/react";

interface FilterItem {
  value: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  selected: string[];
  onChange: (values: string[]) => void;
  singleSelect?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  items,
  selected,
  onChange,
  singleSelect = false
}) => {
  const handleToggle = (value: string) => {
    if (singleSelect) {
      onChange(selected.includes(value) ? [] : [value]);
    } else {
      const newSelected = selected.includes(value)
        ? selected.filter(item => item !== value)
        : [...selected, value];
      onChange(newSelected);
    }
  };

  return (
    <Accordion.Item>
      <Accordion.Button>
        <Box flex="1" textAlign="left" fontWeight="semibold">
          {title}
        </Box>
        <Accordion.Icon />
      </Accordion.Button>
      <Accordion.Panel>
        <Stack spacing={3}>
          {items.map((item) => (
            <Box key={item.value} display="flex" alignItems="center">
              <input
                type="checkbox"
                id={`filter-${title}-${item.value}`}
                checked={selected.includes(item.value)}
                onChange={() => handleToggle(item.value)}
                className="mr-2"
              />
              <label 
                htmlFor={`filter-${title}-${item.value}`}
                className="cursor-pointer"
              >
                {item.label}
              </label>
            </Box>
          ))}
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default FilterSection;