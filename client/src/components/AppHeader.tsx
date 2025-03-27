import DailyTimeLimit from "@/components/DailyTimeLimit";

interface AppHeaderProps {
  dailyLimit: number;
  setDailyLimit: (limit: number) => void;
}

const AppHeader = ({ dailyLimit, setDailyLimit }: AppHeaderProps) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <i className="ri-time-line text-primary text-2xl"></i>
            <h1 className="text-xl font-semibold text-gray-800">TaskTime</h1>
          </div>
          
          <DailyTimeLimit 
            dailyLimit={dailyLimit} 
            setDailyLimit={setDailyLimit} 
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
