// // src/components/EditSessionForm.js
// import React, { useState, useEffect } from 'react';
// import { updateSession } from '../../api/codingSessionApi'

// export default function EditSessionForm({ session, onSuccess, onCancel }) {
//   const [form, setForm] = useState({ ...session });

//   useEffect(() => {
//     setForm({ ...session }); // update when session changes
//   }, [session]);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleChange = (e: { target: { name: any; value: any; }; }) => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     setForm((prev: any) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     updateSession(session.id, form)
//       .then(() => {
//         onSuccess();
//       })
//       .catch((err) => console.error(err));
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h3>Edit Session</h3>
//       <input name="project_name" placeholder="Project Name" value={form.project_name} onChange={handleChange} required />
//       <input name="language" placeholder="Language" value={form.language} onChange={handleChange} required />
//       <input name="duration" placeholder="Duration (HH:MM:SS)" value={form.duration} onChange={handleChange} required />
//       <input type="datetime-local" name="start_time" value={form.start_time} onChange={handleChange} required />
//       <input type="datetime-local" name="end_time" value={form.end_time} onChange={handleChange} required />
//       <input name="tags" placeholder="Tags" value={form.tags} onChange={handleChange} />
//       <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange}></textarea>
//       <div style={{ marginTop: '10px' }}>
//         <button type="submit">Update</button>
//         <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</button>
//       </div>
//     </form>
//   );
// }
