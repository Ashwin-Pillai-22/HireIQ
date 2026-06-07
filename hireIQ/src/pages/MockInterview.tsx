import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  RotateCcw,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Mic,
  MicOff,
  LogOut,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/lib/userService";

type InterviewState = "setup" | "in-progress" | "review" | "loading";

interface QA {
  questionId: string;
  question: string;
  answer: string;
  feedback?: { score: number; strengths: string; improvement: string };
}

const INTERVIEW_DURATION_SECONDS = 30 * 60;

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const MockInterview = () => {
  const [state, setState] = useState<InterviewState>("setup");
  const [role, setRole] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<{
    questionId: string;
    questionText: string;
    order: number;
  } | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState<QA[]>([]);
  const [progress, setProgress] = useState("0/0");
  const [totalQuestions, setTotalQuestions] = useState<number>(20);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Speech state
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [interimText, setInterimText] = useState(""); // live preview of words being spoken right now

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(INTERVIEW_DURATION_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Exit confirmation dialog
  const [showExitDialog, setShowExitDialog] = useState(false);

  const recognitionRef = useRef<any>(null);
  // Tracks whether the stop was user-initiated (true) vs browser auto-stop on silence (false)
  const manualStopRef = useRef(false);

  const { user, refreshProfile } = useAuth();

  // ─── Speech Recognition Setup ─────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;      // keep listening until manually stopped
    recognition.interimResults = true;  // stream partial results live
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setTranscriptError(null);
    };

    // Fires continuously as the user speaks
    recognition.onresult = (event: any) => {
      let interim = "";
      let newFinal = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinal += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      // Confirmed speech gets appended to the answer textarea
      if (newFinal) {
        setAnswer((prev) =>
          prev ? `${prev.trimEnd()} ${newFinal.trim()} ` : `${newFinal.trim()} `
        );
      }

      // Show unconfirmed in-progress speech as a ghost preview
      setInterimText(interim);
    };

    // Chrome and mobile browsers auto-stop on silence — restart unless user manually stopped
    recognition.onend = () => {
      setInterimText("");
      if (!manualStopRef.current) {
        try {
          recognition.start(); // seamlessly continue recording
        } catch {
          setListening(false);
        }
      } else {
        setListening(false);
        manualStopRef.current = false;
      }
    };

    recognition.onerror = (event: any) => {
      setInterimText("");
      // These are expected non-errors — let onend handle the restart
      if (event.error === "no-speech" || event.error === "aborted") return;

      setTranscriptError(
        event.error === "not-allowed"
          ? "Microphone access denied. Please allow microphone permissions in your browser."
          : event.error === "network"
          ? "Network error during speech recognition. Please check your connection."
          : `Speech recognition error: ${event.error}. Please try again.`
      );
      setListening(false);
      manualStopRef.current = false;
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      manualStopRef.current = true;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

  // Auto-stop recording when the question changes (next question loads)
  useEffect(() => {
    if (listening) {
      manualStopRef.current = true;
      recognitionRef.current?.stop();
      setInterimText("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.questionId]);

  // ─── Timer logic ──────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(INTERVIEW_DURATION_SECONDS);
    setTimedOut(false);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          setTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    if (timedOut && (state === "in-progress" || state === "loading")) {
      finishInterviewEarly("time");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const timerColor =
    timeLeft <= 60
      ? "text-red-600"
      : timeLeft <= 5 * 60
      ? "text-amber-600"
      : "text-foreground";

  const timerBg =
    timeLeft <= 60
      ? "bg-red-50 border-red-200"
      : timeLeft <= 5 * 60
      ? "bg-amber-50 border-amber-200"
      : "bg-secondary/40 border-border/60";

  // ─── Toggle recording ─────────────────────────────────────────────────────
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setTranscriptError("Voice input not supported in this browser.");
      return;
    }
    setTranscriptError(null);

    if (listening) {
      manualStopRef.current = true; // flag so onend won't auto-restart
      recognitionRef.current.stop();
    } else {
      manualStopRef.current = false;
      try {
        recognitionRef.current.start();
      } catch {
        setTranscriptError("Unable to start voice capture. Please try again.");
      }
    }
  };

  // ─── Interview flow ───────────────────────────────────────────────────────
  const startInterview = async () => {
    if (!role.trim()) return;
    setState("loading");
    setError(null);
    try {
      const response = await fetch("/api/interview/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user && { "x-user-id": user.uid }),
        },
        body: JSON.stringify({ topic: role }),
      });
      if (!response.ok) throw new Error("Failed to start interview");
      const data = await response.json();
      const total = data.total_questions ?? 20;
      setSessionId(data.session_id);
      setCurrentQuestion({ questionId: "q01", questionText: data.question, order: 1 });
      setStartedAt(new Date());
      setHistory([]);
      setTotalQuestions(total);
      setProgress(`1/${total}`);
      startTimer();
      setState("in-progress");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setState("setup");
    }
  };

  const saveResultsAndReview = async (
    currentHistory: QA[],
    currentSessionId: string,
    currentRole: string,
    currentStartedAt: Date | null
  ) => {
    let resultData = null;
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      const resultResponse = await fetch(
        `/api/interview/interviews/${currentSessionId}/result`,
        { headers: { ...(user && { "x-user-id": user.uid }) } }
      );
      if (resultResponse.ok) {
        resultData = await resultResponse.json();
        if (resultData.all_scored || retries >= maxRetries - 1) break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      retries++;
    }

    if (resultData) {
      const finalScoreValue = resultData.average_score * 10;
      setFinalScore(finalScoreValue);

      if (user) {
        try {
          await UserService.updateInterviewStats(user.uid, finalScoreValue, true);
          await UserService.saveInterviewRecord(user.uid, {
            topic: currentRole,
            score: finalScoreValue,
            completedAt: new Date(),
            totalQuestions: totalQuestions || resultData.total_questions || 20,
            sessionId: currentSessionId,
          });
          await UserService.saveInterviewReview(user.uid, {
            sessionId: currentSessionId,
            topic: currentRole,
            score: finalScoreValue,
            totalQuestions:
              totalQuestions || resultData.total_questions || currentHistory.length || 20,
            startedAt: currentStartedAt || new Date(),
            completedAt: new Date(),
            questions: currentHistory.map((qa, index) => ({
              questionId: qa.questionId,
              questionText: qa.question,
              answerText: qa.answer,
              score: qa.feedback?.score ?? null,
              feedback: qa.feedback
                ? `${qa.feedback.strengths}. ${qa.feedback.improvement}`
                : "",
              order: index + 1,
              answeredAt: new Date(),
            })),
          });
          if (typeof refreshProfile === "function") await refreshProfile();
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          setError(`Failed to save interview results. ${message}`);
        }
      } else {
        setError("User session expired. Please log in again.");
      }
    } else {
      setError("Failed to calculate interview score. Please try again.");
    }
  };

  const submitAnswer = async () => {
    // Ensure recording is stopped before submitting
    if (listening) {
      manualStopRef.current = true;
      recognitionRef.current?.stop();
      setInterimText("");
    }

    if (!answer.trim() || !sessionId || !currentQuestion) return;
    setState("loading");
    setError(null);
    try {
      const response = await fetch(`/api/interview/interviews/${sessionId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user && { "x-user-id": user.uid }),
        },
        body: JSON.stringify({ answer: answer.trim() }),
      });
      if (!response.ok) throw new Error("Failed to submit answer");
      const data = await response.json();

      const qa: QA = {
        questionId: currentQuestion.questionId,
        question: currentQuestion.questionText,
        answer: answer.trim(),
      };
      const nextHistory = [...history, qa];
      setHistory(nextHistory);
      setAnswer("");

      if (data.completed) {
        stopTimer();
        await saveResultsAndReview(nextHistory, sessionId, role, startedAt);
        setState("review");
      } else {
        setCurrentQuestion({
          questionId: data.nextQuestion.questionId,
          questionText: data.nextQuestion.questionText,
          order: data.nextQuestion.order,
        });
        setProgress(data.progress);
        setState("in-progress");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setState("in-progress");
    }
  };


  const finishInterviewEarly = useCallback(async (reason: "time" | "exit") => {
  stopTimer();
  if (listening) {
    manualStopRef.current = true;
    recognitionRef.current?.stop();
    setInterimText("");
  }
  if (!sessionId || history.length === 0) {
    resetInterview();
    return;
  }
  setState("loading");
  await saveResultsAndReview(history, sessionId, role, startedAt);
  if (reason === "time") setTimedOut(true);
  setState("review");
}, [stopTimer, listening, sessionId, history, role, startedAt]);  // all dependencies listed

useEffect(() => {
  if (timedOut && (state === "in-progress" || state === "loading")) {
    finishInterviewEarly("time");
  }
}, [timedOut, finishInterviewEarly]);  // finishInterviewEarly now included

  const handleExitConfirm = () => {
    setShowExitDialog(false);
    finishInterviewEarly("exit");
  };

  const resetInterview = () => {
    if (listening) {
      manualStopRef.current = true;
      recognitionRef.current?.stop();
      setInterimText("");
    }
    stopTimer();
    setState("setup");
    setSessionId(null);
    setCurrentQuestion(null);
    setStartedAt(null);
    setAnswer("");
    setHistory([]);
    setProgress("0/0");
    setTotalQuestions(20);
    setFinalScore(null);
    setError(null);
    setTimeLeft(INTERVIEW_DURATION_SECONDS);
    setTimedOut(false);
  };

  const fetchFeedback = async (retryCount = 0) => {
    if (!sessionId || history.length === 0) return;
    const maxRetries = 3;
    const delay = 1000 * (retryCount + 1);

    const updatedHistory = await Promise.all(
      history.map(async (qa) => {
        if (qa.feedback) return qa;
        try {
          const response = await fetch(
            `/api/interview/interviews/${sessionId}/questions/${qa.questionId}`,
            { headers: { ...(user && { "x-user-id": user.uid }) } }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.score > 0) {
              return {
                ...qa,
                feedback: {
                  score: data.score * 10,
                  strengths:
                    data.score >= 7 ? "Good technical understanding" : "Shows basic knowledge",
                  improvement: data.feedback || "Consider providing more detailed explanations",
                },
              };
            }
          }
        } catch (err) {
          console.error("Failed to fetch feedback for", qa.questionId, err);
        }
        return qa;
      })
    );

    setHistory(updatedHistory);
    const hasAllFeedback = updatedHistory.every((qa) => qa.feedback);
    if (!hasAllFeedback && retryCount < maxRetries) {
      setTimeout(() => fetchFeedback(retryCount + 1), delay);
    }
  };

  useEffect(() => {
    if (state === "review" && sessionId) {
      const timer = setTimeout(() => fetchFeedback(), 3000);
      return () => clearTimeout(timer);
    }
  }, [state, sessionId]);

  const avgScore =
    finalScore ||
    (history.length
      ? Math.round(
          history.reduce((s, q) => s + (q.feedback?.score || 0), 0) / history.length
        )
      : 0);

  const progressPercent =
    progress === "0/0"
      ? 0
      : (parseInt(progress.split("/")[0]) / parseInt(progress.split("/")[1])) * 100;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved and you'll be taken to the results page. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Going</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm}>Exit Interview</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto flex items-center gap-4 h-16 px-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-xl text-foreground">Mock Interview</h1>

          {(state === "in-progress" || state === "loading") && sessionId && (
            <div className="ml-auto flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-sm font-mono font-medium ${timerBg} ${timerColor}`}
              >
                <Timer className="w-3.5 h-3.5" />
                {formatTime(timeLeft)}
              </div>
              <Badge variant="secondary">{progress}</Badge>
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:text-foreground border-border/60"
                onClick={() => setShowExitDialog(true)}
                disabled={state === "loading"}
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Exit
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-3xl">
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {state === "review" && timedOut && (
          <Card className="border-amber-200 bg-amber-50 mb-6">
            <CardContent className="p-4 flex items-center gap-3">
              <Timer className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-amber-800 text-sm font-medium">
                Time's up — your interview was automatically submitted after 30 minutes.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Setup ─────────────────────────────────────────────────────────── */}
        {state === "setup" && (
          <Card className="border-border/60">
            <CardHeader className="text-center pb-2">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-7 h-7 text-accent" />
              </div>
              <CardTitle className="text-2xl">Start a Mock Interview</CardTitle>
              <CardDescription>
                Practice answering real interview questions tailored to your target role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  You'll have <strong>30 minutes</strong> to complete the interview. It
                  auto-submits when time is up.
                </span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Target Role</label>
                <Input
                  placeholder="e.g. Frontend Developer, Product Manager"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && role.trim() && startInterview()}
                />
              </div>
              <Button
                onClick={startInterview}
                className="w-full"
                size="lg"
                disabled={!role.trim()}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Begin Interview
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Loading ────────────────────────────────────────────────────────── */}
        {state === "loading" && (
          <Card className="border-border/60">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Processing...</p>
            </CardContent>
          </Card>
        )}

        {/* ── In Progress ────────────────────────────────────────────────────── */}
        {state === "in-progress" && currentQuestion && (
          <div className="space-y-6">
            <Progress value={progressPercent} className="h-2" />

            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Question {currentQuestion.order}</span>
                </div>
                <CardTitle className="text-xl leading-relaxed">
                  {currentQuestion.questionText}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Answer textarea */}
                <Textarea
                  placeholder="Type your answer here, or use the mic to speak..."
                  className="min-h-[160px] resize-none"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />

                {/* Live interim speech preview */}
                {interimText && (
                  <div className="flex items-start gap-2 px-3 py-2 rounded-md bg-secondary/50 border border-dashed border-border">
                    <span className="mt-1 w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <p className="text-sm text-muted-foreground italic">{interimText}</p>
                  </div>
                )}

                {/* Active recording status */}
                {listening && (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Recording in progress — speak your answer. Press Stop Recording when done.
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    onClick={toggleListening}
                    variant={listening ? "destructive" : "secondary"}
                    className="flex-1 sm:flex-none"
                    disabled={!speechSupported}
                  >
                    {listening ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={submitAnswer}
                    disabled={!answer.trim()}
                    className="w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Answer
                  </Button>
                </div>

                {transcriptError && (
                  <p className="text-sm text-red-600">{transcriptError}</p>
                )}
                {!speechSupported && (
                  <p className="text-sm text-muted-foreground">
                    Voice input is not available in your browser.
                  </p>
                )}
                {speechSupported && !listening && !transcriptError && (
                  <p className="text-sm text-muted-foreground">
                    Press Start Recording and speak freely. Press Stop Recording when you're done.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Previous answers */}
            {history.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Previous Answers</h3>
                {history.map((qa, i) => (
                  <Card key={i} className="border-border/60 bg-secondary/30">
                    <CardContent className="p-4 space-y-2">
                      <p className="text-sm font-medium text-foreground">
                        Q{i + 1}: {qa.question}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        {qa.feedback ? (
                          <Badge variant={qa.feedback.score >= 70 ? "default" : "secondary"}>
                            {qa.feedback.score}/100
                          </Badge>
                        ) : (
                          <span>Feedback processing...</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Review ─────────────────────────────────────────────────────────── */}
        {state === "review" && (
          <div className="space-y-6">
            <Card className="border-border/60 text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Interview Complete</CardTitle>
                <CardDescription>
                  Here's how you performed across {history.length} question
                  {history.length !== 1 ? "s" : ""}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="w-28 h-28 rounded-full border-4 border-accent/20 flex items-center justify-center mx-auto">
                  <span className="text-3xl font-display text-foreground">
                    {Math.round(avgScore)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {avgScore >= 80
                    ? "Excellent performance! You're well-prepared."
                    : avgScore >= 60
                    ? "Good effort! A few areas to polish."
                    : "Keep practicing — focus on structure and specifics."}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {history.map((qa, i) => (
                <Card key={i} className="border-border/60">
                  <CardContent className="p-5 space-y-3">
                    <p className="font-medium text-foreground">{qa.question}</p>
                    <p className="text-sm text-muted-foreground bg-secondary/40 rounded-lg p-3">
                      {qa.answer}
                    </p>
                    {qa.feedback ? (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {qa.feedback.strengths}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {qa.feedback.improvement}
                            </span>
                          </div>
                        </div>
                        <Badge variant={qa.feedback.score >= 70 ? "default" : "secondary"}>
                          Score: {qa.feedback.score}/100
                        </Badge>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                          Feedback is being processed...
                        </p>
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-3">
              <Button onClick={resetInterview} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Another Interview
              </Button>
              <Button onClick={() => fetchFeedback()} variant="secondary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Refresh Feedback
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MockInterview;