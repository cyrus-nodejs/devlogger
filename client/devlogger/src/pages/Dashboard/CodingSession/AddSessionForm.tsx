// src/components/AddSessionForm.tsx
import React, { useState } from 'react';
import { createSession } from '../../../api/codingSessionApi';
import Navbar from '../../../components/Navbar';

// interface AddSessionProps {
//   onSuccess: () => void;
// }

const AddSessionForm = () => {

  const [form, setForm] = useState({

    project_name: '',
    language: '',
    duration: '',
    start_time: '',
    end_time: '',
    tags: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValidDuration = (duration: string) => /^\d{2}:\d{2}:\d{2}$/.test(duration);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidDuration(form.duration)) {
      setError('Duration must be in HH:MM:SS format.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createSession(form);
   
      setForm({
        project_name: '',
        language: '',
        duration: '',
        start_time: '',
        end_time: '',
        tags: '',
        notes: ''
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to add session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
         <div className=''> 
        <Navbar   />

         <div className="p-4 border border-t-0 h-full overflow-y-auto border-gray-300">
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl  p-6 bg-white dark:bg-Oxfordblue rounded shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Add Coding Session</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className="input-style border rounded dark:bg-Whitesmoke "
          name="project_name"
          placeholder="Project Name"
          value={form.project_name}
          onChange={handleChange}
          required
        />
        <input
          className="input-style border rounded dark:bg-Whitesmoke "
          name="language"
          placeholder="Language"
          value={form.language}
          onChange={handleChange}
          required
        />
        <input
          className="input-style rounded border dark:bg-Whitesmoke"
          name="duration"
          placeholder="Duration (HH:MM:SS)"
          value={form.duration}
          onChange={handleChange}
          required
        />
        <input
          className="input-style border dark:bg-Whitesmoke rounded"
          type="datetime-local"
          name="start_time"
          value={form.start_time}
          onChange={handleChange}
          required
        />
        <input
          className="input-style dark:bg-Whitesmoke border rounded"
          type="datetime-local"
          name="end_time"
          value={form.end_time}
          onChange={handleChange}
          required
        />
        <input
          className="input-style dark:bg-Whitesmoke border rounded"
          name="tags"
          placeholder="Tags"
          value={form.tags}
          onChange={handleChange}
        />
      </div>

      <textarea
        className="input-style dark:bg-Whitesmoke w-full h-24 resize-none rounded border"
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
      />

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">Session added successfully!</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Session'}
      </button>
    </form>
    </div>
       </div>
  );
};

export default AddSessionForm;
