import { useState } from "react";
import SuggestedFriends from "../SuggestedFriends/SuggestedFriends";

export default function SuggestedFriendsDropdown() {

  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-150 mx-auto mb-6 bg bg-slate-50 p-2 rounded-md shadow-2xl">

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center font-semibold"
      >
        Suggested Friends
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-3">
          <SuggestedFriends />
        </div>
      )}

    </div>
  );
}