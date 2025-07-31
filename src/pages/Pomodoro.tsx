import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Clock } from "lucide-react";
import { showSuccess } from "@/utils/toast"; // Removed showError

const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes in seconds
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes in seconds

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const Pomodoro = () => {
  const [timeRemaining, setTimeRemaining] = useState(POMODORO_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleTimerEnd();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  const handleStartPause = () => {
    setIsActive(!isActive);
    if (isActive) {
      showSuccess("Timer paused.");
    } else {
      showSuccess("Timer started!");
    }
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsActive(false);
    setMode("pomodoro");
    setTimeRemaining(POMODORO_DURATION);
    showSuccess("Timer reset.");
  };

  const handleTimerEnd = () => {
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (mode === "pomodoro") {
      setPomodoroCount((prevCount) => prevCount + 1);
      if ((pomodoroCount + 1) % 4 === 0) {
        setMode("longBreak");
        setTimeRemaining(LONG_BREAK_DURATION);
        showSuccess("Pomodoro complete! Time for a long break.");
      } else {
        setMode("shortBreak");
        setTimeRemaining(SHORT_BREAK_DURATION);
        showSuccess("Pomodoro complete! Time for a short break.");
      }
    } else {
      setMode("pomodoro");
      setTimeRemaining(POMODORO_DURATION);
      showSuccess("Break over! Time to focus.");
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getModeTitle = () => {
    switch (mode) {
      case "pomodoro":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Pomodoro Timer";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4 text-primary">Pomodoro Timer</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Boost your productivity with focused work sessions and timely breaks.
        </p>

        <Card className="w-full max-w-md mx-auto text-center p-6">
          <CardHeader>
            <Clock className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-4xl font-extrabold mb-2">{getModeTitle()}</CardTitle>
            <CardDescription className="text-xl text-muted-foreground">
              Pomodoros completed: {pomodoroCount}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-7xl font-bold text-foreground mb-8">
              {formatTime(timeRemaining)}
            </div>
            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={handleStartPause}>
                {isActive ? (
                  <>
                    <Pause className="h-6 w-6 mr-2" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-6 w-6 mr-2" /> Start
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-6 w-6 mr-2" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Pomodoro;