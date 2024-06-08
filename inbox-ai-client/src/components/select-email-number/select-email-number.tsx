import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectNumberProps {
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export function SelectEmailNumber({
  defaultValue = 15,
  onChange,
}: SelectNumberProps) {
  const [selectedNumber, setSelectedNumber] = useState<number>(defaultValue);

  const handleSelect = (value: string) => {
    const number = parseInt(value);
    if (!isNaN(number)) {
      setSelectedNumber(number);
      if (onChange) {
        onChange(number);
      }
    }
  };

  const generateOptions = () => {
    const options = [];
    for (let i = 5; i <= 100; i += 5) {
      options.push(
        <SelectItem key={i} value={i.toString()}>
          {i}
        </SelectItem>
      );
    }
    return options;
  };

  return (
    <Select value={selectedNumber.toString()} onValueChange={handleSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a number" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>{generateOptions()}</SelectGroup>
      </SelectContent>
    </Select>
  );
}
