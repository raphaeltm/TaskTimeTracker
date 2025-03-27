import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: string[]) => void;
}

const VoiceInputModal = ({ isOpen, onClose, onAddTasks }: VoiceInputModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recognizedText, setRecognizedText] = useState("");
  const recognition = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognitionAPI();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      
      recognition.current.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setRecognizedText(transcript);
      };
      
      recognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (isRecording) {
          toggleRecording();
        }
      };
    }
    
    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Reset modal state when it opens/closes
  useEffect(() => {
    if (!isOpen) {
      if (isRecording) {
        toggleRecording();
      }
      setRecognizedText("");
      setRecordingTime(0);
    }
  }, [isOpen]);
  
  const toggleRecording = () => {
    if (!recognition.current) return;
    
    if (!isRecording) {
      // Start recording
      recognition.current.start();
      setIsRecording(true);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          // Auto-stop after 30 seconds
          if (newTime >= 30) {
            toggleRecording();
          }
          return newTime;
        });
      }, 1000);
    } else {
      // Stop recording
      recognition.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };
  
  const handleAddTasks = () => {
    if (recognizedText.trim()) {
      const tasks = recognizedText
        .trim()
        .split(/[\.!?]\s+/)
        .filter(task => task.trim())
        .map(task => task.trim());
      
      onAddTasks(tasks);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Input</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-8">
          <div className="mb-6 text-gray-700">
            {isRecording ? "Listening..." : "Click to start speaking..."}
          </div>
          
          <Button
            onClick={toggleRecording}
            className={`inline-flex justify-center items-center h-24 w-24 rounded-full ${
              isRecording ? "animate-pulse" : ""
            }`}
          >
            <i className="ri-mic-line text-3xl"></i>
          </Button>
          
          {isRecording && (
            <div className="mt-3 text-sm text-gray-500">
              Recording: <span>{recordingTime}</span>s
            </div>
          )}
          
          {recognizedText && (
            <div className="mt-4 bg-gray-50 p-3 rounded text-left text-sm max-h-36 overflow-y-auto">
              {recognizedText}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddTasks} disabled={!recognizedText.trim()}>
            Add Tasks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceInputModal;
