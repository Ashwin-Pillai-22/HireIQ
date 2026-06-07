import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const removeUndefinedFields = <T extends Record<string, any>>(data: T): Partial<T> => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
  role?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
  };
  interviewStats?: {
    totalInterviews: number;
    averageScore: number;
    completedInterviews: number;
  };
  pastInterviews?: InterviewRecord[];
}

export interface InterviewRecord {
  id: string;
  topic: string;
  score: number;
  completedAt: Date;
  totalQuestions: number;
  sessionId: string;
}

export interface InterviewQuestionReview {
  questionId: string;
  questionText: string;
  answerText: string;
  score?: number | null;
  feedback?: string;
  order: number;
  answeredAt?: Date;
}

export interface InterviewReviewRecord {
  sessionId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  startedAt: Date;
  completedAt: Date;
  questions: InterviewQuestionReview[];
}

export class UserService {
  private static COLLECTION = 'users';

  // Create user profile in Firestore
  static async createUserProfile(uid: string, email: string, additionalData?: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, this.COLLECTION, uid);
    const userData: UserProfile = removeUndefinedFields({
      uid,
      email,
      createdAt: new Date(),
      lastLoginAt: new Date(),
      interviewStats: {
        totalInterviews: 0,
        averageScore: 0,
        completedInterviews: 0,
      },
      ...additionalData,
    }) as UserProfile;

    await setDoc(userRef, userData, { merge: true });
  }

  // Get user profile from Firestore
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, this.COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      
      // Convert Firestore timestamps to Date objects
      const convertedPastInterviews = (data.pastInterviews || []).map((interview: any) => ({
        ...interview,
        completedAt: interview.completedAt?.toDate ? interview.completedAt.toDate() : new Date(interview.completedAt),
      }));
      
      return {
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate() : new Date(data.lastLoginAt),
        pastInterviews: convertedPastInterviews,
        interviewStats: data.interviewStats || {
          totalInterviews: 0,
          averageScore: 0,
          completedInterviews: 0,
        },
      } as UserProfile;
    }
    return null;
  }

  // Update user profile
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = doc(db, this.COLLECTION, uid);
    await updateDoc(userRef, {
      ...removeUndefinedFields(updates),
      lastLoginAt: new Date(),
    });
  }

  // Update user login time
  static async updateLastLogin(uid: string): Promise<void> {
    const userRef = doc(db, this.COLLECTION, uid);
    await updateDoc(userRef, {
      lastLoginAt: new Date(),
    });
  }

  // Update interview stats
  static async updateInterviewStats(uid: string, score: number, completed: boolean = true): Promise<void> {
    try {
      console.log('updateInterviewStats called with uid:', uid, 'score:', score, 'completed:', completed);
      const userRef = doc(db, this.COLLECTION, uid);
      const userSnap = await getDoc(userRef);

      const currentStats = userSnap.exists()
        ? (userSnap.data() as UserProfile).interviewStats || { totalInterviews: 0, averageScore: 0, completedInterviews: 0 }
        : { totalInterviews: 0, averageScore: 0, completedInterviews: 0 };

      console.log('Current stats:', currentStats);

      const newTotalInterviews = currentStats.totalInterviews + 1;
      const newCompletedInterviews = completed ? currentStats.completedInterviews + 1 : currentStats.completedInterviews;

      // Calculate new average score
      const totalScoreSum = currentStats.averageScore * currentStats.totalInterviews + score;
      const newAverageScore = totalScoreSum / newTotalInterviews;

      const newStats = {
        totalInterviews: newTotalInterviews,
        averageScore: Math.round(newAverageScore * 100) / 100,
        completedInterviews: newCompletedInterviews,
      };

      console.log('New stats:', newStats);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          interviewStats: newStats,
          lastLoginAt: new Date(),
        });

        console.log('Interview stats updated successfully');
      } else {
        console.warn('User profile missing; creating a new profile document and saving interview stats');
        await setDoc(userRef, {
          uid,
          email: '',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          interviewStats: newStats,
          pastInterviews: [],
        }, { merge: true });
        console.log('Interview stats saved with new user profile document');
      }
    } catch (error) {
      console.error('Error in updateInterviewStats:', error);
      throw error;
    }
  }

  // Save interview record
  static async saveInterviewRecord(uid: string, interviewData: Omit<InterviewRecord, 'id'>): Promise<void> {
    try {
      console.log('saveInterviewRecord called with uid:', uid, 'interview data:', interviewData);
      const userRef = doc(db, this.COLLECTION, uid);
      const userSnap = await getDoc(userRef);

      const interviewRecord: InterviewRecord = {
        id: `${interviewData.sessionId}_${Date.now()}`,
        ...interviewData,
      };

      console.log('Creating interview record:', interviewRecord);

      if (userSnap.exists()) {
        const currentData = userSnap.data() as UserProfile;
        const pastInterviews = currentData.pastInterviews || [];

        // Keep only the last 50 interviews to avoid document size limits
        const updatedInterviews = [interviewRecord, ...pastInterviews].slice(0, 50);

        console.log('Updated interviews count:', updatedInterviews.length);

        await updateDoc(userRef, {
          pastInterviews: updatedInterviews,
          lastLoginAt: new Date(),
        });

        console.log('Interview record saved successfully');
      } else {
        console.warn('User profile missing; creating a new profile document and saving interview record');
        await setDoc(userRef, {
          uid,
          email: '',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          interviewStats: {
            totalInterviews: 0,
            averageScore: 0,
            completedInterviews: 0,
          },
          pastInterviews: [interviewRecord],
        }, { merge: true });
        console.log('Interview record saved with new user profile document');
      }
    } catch (error) {
      console.error('Error in saveInterviewRecord:', error);
      throw error;
    }
  }

  // Save detailed interview review in the user document
  static async saveInterviewReview(uid: string, review: InterviewReviewRecord): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, uid);
      const userSnap = await getDoc(userRef);
      const currentData = userSnap.exists() ? (userSnap.data() as any) : {};
      const existingReviews = currentData.interviewReviews || [];
      const updatedReviews = [review, ...existingReviews].slice(0, 10);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          interviewReviews: updatedReviews,
          lastLoginAt: new Date(),
        });
      } else {
        await setDoc(userRef, {
          uid,
          email: '',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          interviewStats: {
            totalInterviews: 0,
            averageScore: 0,
            completedInterviews: 0,
          },
          pastInterviews: [],
          interviewReviews: updatedReviews,
        }, { merge: true });
      }

      console.log('Interview review saved successfully for user:', uid, 'session:', review.sessionId);
    } catch (error) {
      console.error('Error in saveInterviewReview:', error);
      throw error;
    }
  }

  // Get saved review sessions for a user
  static async getInterviewReviews(uid: string): Promise<InterviewReviewRecord[]> {
    try {
      const userRef = doc(db, this.COLLECTION, uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        return [];
      }

      const data = userSnap.data() as any;
      const reviews = (data.interviewReviews || []) as any[];
      return reviews.map((review) => ({
        ...review,
        startedAt: review.startedAt?.toDate ? review.startedAt.toDate() : new Date(review.startedAt),
        completedAt: review.completedAt?.toDate ? review.completedAt.toDate() : new Date(review.completedAt),
        questions: (review.questions || []).map((question: any) => ({
          ...question,
          answeredAt: question.answeredAt?.toDate ? question.answeredAt.toDate() : question.answeredAt ? new Date(question.answeredAt) : undefined,
        })),
      } as InterviewReviewRecord));
    } catch (error) {
      console.error('Error loading interview reviews:', error);
      return [];
    }
  }

  // Check if user exists
  static async userExists(uid: string): Promise<boolean> {
    const userRef = doc(db, this.COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  }

  // Get user by email (useful for admin functions)
  static async getUserByEmail(email: string): Promise<UserProfile | null> {
    const q = query(collection(db, this.COLLECTION), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      } as UserProfile;
    }
    return null;
  }
}