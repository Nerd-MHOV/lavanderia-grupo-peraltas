"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Option = { label: string; value: string };

interface ISelectProps {
  placeholder: string;
  options: Option[];
  name: string
  defaultValue?: Option[];
}
const MultiSelect = ({
  placeholder,
  name,
  options: values,
  defaultValue,
}: ISelectProps) => {
  const [selectedItems, setSelectedItems] = useState<Option[]>(defaultValue || []);

  const handleSelectChange = (value: string) => {
    console.log(value);
    const el = values.find(opt => opt.value === value)
    if (el) {
      if (!selectedItems.find(sli => sli.value === value)) {
        setSelectedItems((prev) => [...prev, el]);
      } else {
        setSelectedItems(selectedItems.filter((sci) => sci.value !== value));
      }
    }
  };

  const isOptionSelected = (value: string): boolean => {
    return selectedItems.find( sci => sci.value === value) ? true : false;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
          >
            <div>{
              selectedItems.length
                ? selectedItems.map(sci => sci.label).join(', ')
                : placeholder
            }</div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-96 max-h-64 overflow-y-auto"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {values.map((value: ISelectProps["options"][0], index: number) => {
            return (
              <DropdownMenuCheckboxItem
                onSelect={(e) => e.preventDefault()}
                key={index}
                checked={isOptionSelected(value.value)}
                onCheckedChange={() => handleSelectChange(value.value)}
              >
                {value.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <input type="hidden" name={name} value={JSON.stringify(selectedItems.map(select => select.value ))} />
    </>
  );
};

export default MultiSelect;