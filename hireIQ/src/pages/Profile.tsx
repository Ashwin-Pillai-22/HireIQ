import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Mail, Calendar, TrendingUp, CheckCircle, ArrowLeft, Clock, Target, Pencil, X, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserService, InterviewReviewRecord } from '@/lib/userService';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const formatDate = (date: any): string => {
  if (!date) return 'Unknown';
  try {
    if (date instanceof Date) return date.toLocaleDateString();
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    return 'Unknown';
  } catch {
    return 'Unknown';
  }
};

const Profile = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [interviewReviews, setInterviewReviews] = useState<InterviewReviewRecord[]>([]);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);
  const [reviewsError, setReviewsError] = useState('');

  // Name editing state
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    const loadReviewSessions = async () => {
      if (!user) { setReviewsLoaded(true); return; }
      try {
        const reviews = await UserService.getInterviewReviews(user.uid);
        if (active) setInterviewReviews(reviews);
      } catch {
        if (active) setReviewsError('Failed to load interview reviews.');
      } finally {
        if (active) setReviewsLoaded(true);
      }
    };
    loadReviewSessions();
    return () => { active = false; };
  }, [user]);

  const profile = userProfile ?? {
    uid: user?.uid || '',
    email: user?.email || '',
    displayName: user?.displayName || '',
    createdAt: new Date(),
    lastLoginAt: new Date(),
    interviewStats: { totalInterviews: 0, averageScore: 0, completedInterviews: 0 },
    pastInterviews: [],
  };

  const startEditName = () => {
    setNameInput(profile.displayName || '');
    setNameError('');
    setNameSuccess(false);
    setEditingName(true);
  };

  const cancelEditName = () => {
    setEditingName(false);
    setNameError('');
  };

  const saveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) { setNameError('Name cannot be empty.'); return; }
    if (trimmed === profile.displayName) { setEditingName(false); return; }
    if (!user) return;

    setNameSaving(true);
    setNameError('');
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, { displayName: trimmed });

      // Update Firestore user document
      await UserService.updateUserProfile(user.uid, { displayName: trimmed });

      // Refresh profile in context
      if (typeof refreshProfile === 'function') await refreshProfile();

      setNameSuccess(true);
      setEditingName(false);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : 'Failed to update name. Please try again.');
    } finally {
      setNameSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and view your interview statistics.</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Editable Name */}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                {editingName ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveName();
                          if (e.key === 'Escape') cancelEditName();
                        }}
                        placeholder="Enter your name"
                        className="h-9"
                        autoFocus
                        disabled={nameSaving}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={saveName}
                        disabled={nameSaving}
                      >
                        {nameSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={cancelEditName}
                        disabled={nameSaving}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {nameError && <p className="text-xs text-red-600">{nameError}</p>}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 group">
                    <p className="text-lg font-semibold">{profile.displayName || 'N/A'}</p>
                    <button
                      onClick={startEditName}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                      title="Edit name"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    {nameSuccess && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Saved
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{profile.email || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {formatDate(profile.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Last login: {formatDate(profile.lastLoginAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Interview Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Interview Statistics
              </CardTitle>
              <CardDescription>Performance summary from completed mock interviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed Interviews</span>
                <span className="text-2xl font-bold text-green-600">{profile.interviewStats?.completedInterviews || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Average Score</span>
                <span className="text-2xl font-bold text-accent">{profile.interviewStats?.averageScore || 0}/100</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Past Interviews */}
        {profile.pastInterviews && profile.pastInterviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Past Interviews
              </CardTitle>
              <CardDescription>Your recent interview history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.pastInterviews.slice(0, 10).map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{interview.topic}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {interview.totalQuestions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(interview.completedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        interview.score >= 80 ? 'text-green-600' :
                        interview.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {Math.round(interview.score)}/100
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {interview.score >= 80 ? 'Excellent' :
                         interview.score >= 60 ? 'Good' : 'Needs Improvement'}
                      </div>
                    </div>
                  </div>
                ))}
                {profile.pastInterviews.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Showing last 10 interviews. Total: {profile.pastInterviews.length}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;