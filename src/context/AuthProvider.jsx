import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { auth } from "../firebase.config";
import toast from "react-hot-toast";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  const signInWithGithub = () => {
    return signInWithPopup(auth, githubProvider);
  };

  const updateUserProfile = (displayName, photoURL) => {
    toast.loading("Saving the profile...", { id: "update-profile" });
    updateProfile(auth.currentUser, { displayName, photoURL })
      .then(() => {
        setUser({ ...user, displayName, photoURL });
        toast.success("Profile updated successfully...", {
          id: "update-profile",
        });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error updating the profile...", { id: "update-profile" });
      });
  };

  const deleteUserAccount = () => {
    if (!auth.currentUser) {
      toast.error("No user is currently signed in", { id: "delete-account" });
      return Promise.reject(new Error("No user signed in"));
    }

    toast.loading("Deleting account...", { id: "delete-account" });
    return deleteUser(auth.currentUser)
      .then(() => {
        setUser(null);
        toast.success("Account deleted successfully", { id: "delete-account" });
      })
      .catch((error) => {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account: " + error.message, { id: "delete-account" });
        throw error;
      });
  };

  const logout = () => {
    setIsLoading(true);
    signOut(auth);
  };

  const userInfo = {
    createUser,
    loginWithEmailAndPassword,
    signInWithGoogle,
    signInWithGithub,
    updateUserProfile,
    deleteUserAccount,
    logout,
    isLoading,
    user,
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (!currentUser.email && currentUser.providerData.length > 0) {
          if (currentUser.providerData[0].email) {
            setUser({
              ...currentUser,
              email: currentUser.providerData[0].email,
            });
            setIsLoading(false);
            return;
          }
        }
      }
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unSubscribe();
  }, []);

  return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;