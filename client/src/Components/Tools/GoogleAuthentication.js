import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './configure';

async function AuthenticateWindow() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const displayName = user.displayName;
    const userEmail = user.email;
    const userId = user.uid;

    return {
      displayName,
      userEmail,
      userId,
    };
  } catch {
   
  }
}

export { AuthenticateWindow };
