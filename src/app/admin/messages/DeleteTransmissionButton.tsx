"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteTransmissionButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this transmission? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transmission");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete transmission. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-400 transition-colors p-sm rounded-md hover:bg-red-500/10"
      title="Delete Transmission"
    >
      {isDeleting ? "..." : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      )}
    </button>
  );
}
