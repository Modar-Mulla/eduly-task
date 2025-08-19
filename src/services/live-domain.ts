import { LiveStateDto,  StudentDto, LiveSnapshotDto, type ExamStatus } from "@/shared-fe/types/dto";

const NAMES = [
  "Alice Nguyen","Bob Johansson","Carla Mendes","David Rossi","Elena García",
  "Farid Khan","Grace Lee","Hassan Ali","Ivy Müller","Jonas Schmidt"
];

let state = createInitialState();

export function getLiveState(): LiveStateDto {
  // Return a deep-ish copy to avoid accidental mutation
  return JSON.parse(JSON.stringify(state));
}

export function advanceTick(): LiveStateDto {
  mutateStudents(state.students);
  state.snapshot = computeSnapshot(state.students);
  return getLiveState();
}

function createInitialState(): LiveStateDto {
  const totalQuestions = 40;
  const students: StudentDto[] = NAMES.map((name, i) => {
    const completed = Math.floor(Math.random() * 5);
    const status: ExamStatus =
      completed === 0 ? "Not Started" : "In Progress";
    return {
      id: String(i + 1),
      name,
      completed,
      totalQuestions,
      avgTimeSec: 45 + Math.floor(Math.random() * 30),
      score: 0,
      status,
    };
  });

  const exam = {
    title: "Midterm Assessment",
    subject: "Mathematics I",
    dateISO: new Date().toISOString().slice(0, 10),
    time24h: new Date().toTimeString().slice(0, 5),
    totalStudents: students.length,
    totalQuestions,
  };

  const snapshot = computeSnapshot(students);
  return { exam, students, snapshot };
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function mutateStudents(students: StudentDto[]) {
  const updates = 2 + Math.floor(Math.random() * 3);
  for (let k = 0; k < updates; k++) {
    const i = Math.floor(Math.random() * students.length);
    const s = students[i];
    if (s.status === "Completed") continue;

    const step = Math.random() < 0.75 ? 1 : 0;
    s.completed = clamp(s.completed + step, 0, s.totalQuestions);

    s.avgTimeSec = clamp(s.avgTimeSec + (Math.random() - 0.5) * 2.5, 20, 120);

    const progress = s.completed / s.totalQuestions;
    const noise = (Math.random() - 0.5) * 6;
    s.score = clamp(Math.round(progress * 100 + noise), 0, 100);

    s.status =
      s.completed === 0 ? "Not Started" :
      s.completed >= s.totalQuestions ? "Completed" :
      "In Progress";
  }
}

export function computeSnapshot(students: StudentDto[]): LiveSnapshotDto {
  const n = Math.max(1, students.length);
  const avgScore = students.reduce((a, s) => a + s.score, 0) / n;
  const completedCount = students.filter(s => s.status === "Completed").length;
  const pctCompleted = (completedCount / n) * 100;

  const statusDist = students.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    },
    { "Not Started": 0, "In Progress": 0, "Completed": 0 } as Record<ExamStatus, number>
  );

  return {
    ts: Date.now(),
    avgScore: Math.round(avgScore * 10) / 10,
    pctCompleted: Math.round(pctCompleted * 10) / 10,
    statusDist,
  };
}
