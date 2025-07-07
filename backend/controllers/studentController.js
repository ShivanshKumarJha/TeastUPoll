const Student = require('../models/Student');

exports.registerStudent = async (name, socketId) => {
  const token = `student-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const student = new Student({
    token,
    name,
    socketId,
  });

  return await student.save();
};

exports.updateStudentSocket = async (token, socketId) => {
  return await Student.findOneAndUpdate(
    { token },
    { socketId, lastActive: new Date() },
    { new: true }
  );
};

exports.kickStudent = async token => {
  try {
    // Find student by token
    const student = await Student.findOne({ token });
    return student;
  } catch (err) {
    console.error('Kick student error:', err);
    throw err;
  }
};

exports.getActiveStudents = async () => {
  // Consider active if last active within 5 minutes
  const fiveMinutesAgo = new Date();
  fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

  return await Student.find({
    lastActive: { $gte: fiveMinutesAgo },
  }).exec();
};
