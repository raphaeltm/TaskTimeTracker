import { Progress } from "@/components/ui/progress";

interface TimeStatusProps {
  totalTime: number;
  remainingTime: number;
  dailyLimit: number;
}

const TimeStatus = ({ totalTime, remainingTime, dailyLimit }: TimeStatusProps) => {
  const percentUsed = Math.min(100, Math.round((totalTime / dailyLimit) * 100));
  
  const getProgressColor = () => {
    if (percentUsed >= 90) return "bg-red-500";
    if (percentUsed >= 75) return "bg-amber-500";
    return "bg-primary";
  };
  
  const getRemainingTimeColor = () => {
    if (remainingTime <= 30) return "text-xl font-semibold text-red-600";
    if (remainingTime <= 60) return "text-xl font-semibold text-amber-600";
    return "text-xl font-semibold text-green-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-6 mb-2">
        <h3 className="text-base font-medium">Time Status</h3>
        
        <div className="w-full sm:w-auto grid grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-gray-500">Total Time:</span>
            <div className="text-xl font-semibold">{totalTime} min</div>
          </div>
          
          <div>
            <span className="text-sm text-gray-500">Remaining:</span>
            <div className={getRemainingTimeColor()}>{remainingTime} min</div>
          </div>
        </div>
      </div>
      
      <Progress 
        value={percentUsed} 
        className="h-2.5 bg-gray-200"
        indicatorClassName={getProgressColor()}
      />
    </div>
  );
};

export default TimeStatus;
