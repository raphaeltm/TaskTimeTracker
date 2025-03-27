import { Button } from "@/components/ui/button";

interface AppFooterProps {
  onClearAll: () => void;
  onSaveForLater: () => void;
}

const AppFooter = ({ onClearAll, onSaveForLater }: AppFooterProps) => {
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all tasks?')) {
      onClearAll();
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            TaskTime - Plan your day efficiently
          </p>
          <div className="mt-2 md:mt-0 flex items-center">
            <Button 
              variant="ghost" 
              onClick={handleClearAll}
              className="text-sm text-gray-500 hover:text-red-500 mr-4"
            >
              <i className="ri-delete-bin-line mr-1"></i>
              Clear All Tasks
            </Button>
            <Button 
              variant="ghost" 
              onClick={onSaveForLater}
              className="text-sm text-primary hover:text-blue-700"
            >
              <i className="ri-save-line mr-1"></i>
              Save for Later
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
