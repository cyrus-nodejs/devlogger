
// src/components/CodingSessionsList.tsx
import  { useEffect, useState } from 'react';
import { getSessions, deleteSession } from '../../../api/codingSessionApi';
import type { CODINGSESSION } from '../../../utils/@types';
import Navbar from '../../../components/Navbar';

// interface CodingSessionsListProps {
//   onEdit: (session: CODINGSESSION) => void;
// }

const CodingSessionsList= () => {
  const [sessions, setSessions] = useState<CODINGSESSION[]>([]);
  const [error, setError] = useState<string | null>(null);
  // const [editingSession, setEditingSession] = useState<CODINGSESSION | null>(null);
  const fetchData = async () => {
    try {
      const res = await getSessions();
      console.log("Response from API:", res.data);
      const data = Array.isArray(res.data) ? res.data : res.data.sessions; // ← adjust based on API
      setSessions(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load sessions.');
    }
  };

  const handleDelete = async (id: string |number) => {
    try {
      await deleteSession(id);
      fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete session.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
        <div className=''> 
        <Navbar   />

         <div className="p-4 border border-t-0 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-Oxfordblue scrollbar-track-Deftblue border-gray-300">
    <div className=" max-w-xl h-96 border border-gray-400 p-4">
      <h2 className="text-2xl font-bold mb-4 dark:text-Whitesmoke">Your Coding Sessions</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {!Array.isArray(sessions) ? (
        <p className="text-gray-500">No coding sessions found.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="border rounded-md p-4 shadow-sm bg-white dark:bg-Oxfordblue hover:shadow-md transition"
            >
              <div className="font-semibold text-lg dark:text-Whitesmoke ">
                {session.project_name}
              </div>
              <div className="text-sm dark:text-Whitesmoke">
                Language: <span className="font-medium dark:text-Whitesmoke">{session.language}</span>
              </div>
              <div className="text-sm dark:text-Whitesmoke">
                {new Date(session.start_time).toLocaleString()} →{' '}
                {new Date(session.end_time).toLocaleString()}
              </div>
              <div className="text-sm dark:text-Whitesmoke">
                Tags: <span className="dark:text-Whitesmoke">{session.tags}</span>
              </div>

              <div className="mt-3 flex gap-3">
                <button
              
                  className="px-4 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(session.id)}
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default CodingSessionsList;
