import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DailyTimeLimitProps {
  dailyLimit: number;
  setDailyLimit: (limit: number) => void;
}

const timeOptions = [
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
  { value: 300, label: "5 hours" },
  { value: 360, label: "6 hours" },
  { value: 420, label: "7 hours" },
  { value: 480, label: "8 hours" },
];

const DailyTimeLimit = ({ dailyLimit, setDailyLimit }: DailyTimeLimitProps) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="dailyLimit" className="text-sm font-medium text-gray-700">
        Max daily time:
      </label>
      <Select
        value={dailyLimit.toString()}
        onValueChange={(value) => setDailyLimit(parseInt(value))}
      >
        <SelectTrigger className="h-9 py-1.5 w-32" id="dailyLimit">
          <SelectValue placeholder="Select limit" />
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DailyTimeLimit;
