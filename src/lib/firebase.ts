import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});
googleProvider.addScope('https://www.googleapis.com/auth/tasks');
googleProvider.addScope('https://www.googleapis.com/auth/tasks.readonly');

export const githubProvider = new GithubAuthProvider();

export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// In-memory caching for OAuth access token (never stored in localStorage)
let cachedAccessToken: string | null = null;

export async function getAccessToken(): Promise<string | null> {
  return cachedAccessToken;
}

export function setAccessToken(token: string | null) {
  cachedAccessToken = token;
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }
    return { user: result.user, accessToken: credential?.accessToken || null, error: null };
  } catch (error: any) {
    console.error('Firebase Google Sign-In Error:', error);
    return { user: null, accessToken: null, error: error?.message || 'Google Sign-In failed' };
  }
}

export async function signInWithGithub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Firebase GitHub Sign-In Error:', error);
    return { user: null, error: error?.message || 'GitHub Sign-In failed' };
  }
}

export async function logoutFirebase() {
  try {
    cachedAccessToken = null;
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Firebase Logout Error:', error);
    return { success: false, error: error?.message };
  }
}

// Subscribe to real-time user workspace document on Firestore
export function subscribeToWorkspace(
  uid: string,
  onData: (data: any) => void,
  onEmptyFirstLogin: () => void
) {
  // Guard: Only subscribe if Firebase Auth user is logged in matching uid
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    return () => {};
  }

  const workspaceRef = doc(db, 'workspaces', uid);

  return onSnapshot(
    workspaceRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onData(data);
      } else {
        // Document does not exist yet -> notify app
        onEmptyFirstLogin();
      }
    },
    (error) => {
      console.error('Firestore Workspace Realtime Listener Error:', error);
    }
  );
}

// Save or Update user workspace document in Firestore
export async function saveWorkspaceToFirestore(uid: string, workspaceData: any) {
  if (!uid) return;
  // Guard: Only write if Firebase Auth user is logged in matching uid
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    return;
  }

  try {
    const workspaceRef = doc(db, 'workspaces', uid);
    await setDoc(
      workspaceRef,
      {
        ownerUid: uid,
        updatedAt: new Date().toISOString(),
        ...workspaceData,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving workspace to Firestore:', error);
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };

