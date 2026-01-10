"use client";
import React, { useEffect, useState } from "react";
import { UserProfile } from "../Profile/page";
import { getPotentialMatches, likeUser } from "@/lib/actions/matches";
import { useRouter } from "next/navigation";
import MatchCard from "@/components/MatchCard";
import MatchButtons from "@/components/MatchButtons";

function MatchesPage() {
  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);

  const handleLike = async () => {
    if (currentIndex < potentialMatches.length) {
      const likedUser = potentialMatches[currentIndex];

      try {
        const result = await likeUser(likedUser.id);

        if (result.isMatch) {
          setMatchedUser(result.matchedUser!);
          setShowMatchNotification(true);
        }

        setCurrentIndex((prev) => prev + 1);
      } catch (err) {
        console.error(err);
      }
    }
  };
  const handlePass = () => {
    if (currentIndex < potentialMatches.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      try {
        const potentialMatchesData = await getPotentialMatches();
        setPotentialMatches(potentialMatchesData);
        console.log("Result of Matches", potentialMatchesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const currentPotentialMatch = potentialMatches[currentIndex];
  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Finding your matches...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
              title="Go back"
            >
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="flex-1" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Discover Matches
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {currentIndex + 1} of {potentialMatches.length} profiles
            </p>
          </div>
        </header>
        <div className="max-w-md mx-auto">
          <MatchCard user={currentPotentialMatch} />
          <div className="mt-8">
            <MatchButtons onLike={handleLike} onPass={handlePass} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchesPage;
