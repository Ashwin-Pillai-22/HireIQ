// Test Firestore connection and basic operations
import { UserService } from './userService';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');

    // Test basic Firestore operations
    const testUserId = 'test-user-id';
    const testEmail = 'test@example.com';

    // Create a test user profile
    await UserService.createUserProfile(testUserId, testEmail, {
      displayName: 'Test User',
    });
    console.log('✅ User profile created');

    // Get the user profile
    const profile = await UserService.getUserProfile(testUserId);
    console.log('✅ User profile retrieved:', profile);

    // Update interview stats
    await UserService.updateInterviewStats(testUserId, 85);
    console.log('✅ Interview stats updated');

    // Get updated profile
    const updatedProfile = await UserService.getUserProfile(testUserId);
    console.log('✅ Updated profile:', updatedProfile);

    console.log('🎉 Firestore integration test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    return false;
  }
};

// Test with authenticated user
export const testAuthenticatedUser = async (email: string, password: string) => {
  try {
    console.log('Testing authenticated user operations...');

    // Sign in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    console.log('✅ User signed in');

    // Get user profile
    const profile = await UserService.getUserProfile(uid);
    console.log('✅ User profile loaded:', profile);

    // Update profile
    await UserService.updateUserProfile(uid, {
      displayName: 'Updated Name',
    });
    console.log('✅ Profile updated');

    console.log('🎉 Authenticated user test completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Authenticated user test failed:', error);
    return false;
  }
};