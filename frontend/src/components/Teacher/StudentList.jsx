import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('activeStudents', setStudents);
      socket.on('studentConnected', student => {
        setStudents(prev => [...prev, student]);
      });
      socket.on('studentReconnected', student => {
        setStudents(prev =>
          prev.map(s => (s.token === student.token ? student : s))
        );
      });
      socket.on('studentKicked', token => {
        setStudents(prev => prev.filter(s => s.token !== token));
      });

      socket.emit('requestActiveStudents');

      return () => {
        socket.off('activeStudents');
        socket.off('studentConnected');
        socket.off('studentReconnected');
        socket.off('studentKicked');
      };
    }
  }, [socket]);

  const handleKick = token => {
    if (window.confirm('Are you sure you want to kick this student?')) {
      socket.emit('kickStudent', token);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Active Students ({students.length})
      </h2>

      {students.length === 0 ? (
        <p className="text-gray-600 text-center">No active students</p>
      ) : (
        <ul className="divide-y">
          {students.map(student => (
            <li
              key={student.token}
              className="py-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-500">
                  ID: {student.token.slice(9, 21)}
                </p>
              </div>
              <button
                onClick={() => handleKick(student.token)}
                className="text-red-600 font-semibold hover:underline hover:text-red-700 transition"
              >
                Kick Out
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentList;
