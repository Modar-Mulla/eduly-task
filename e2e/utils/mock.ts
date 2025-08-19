import { type Page } from "@playwright/test";

export async function mockLiveState(page: Page) {
  await page.route("**/api/live**", async (route) => {
    const now = Date.now();
    const payload = {
      exam: {
        title: "Midterm Algebra",
        subject: "Mathematics",
        dateISO: "2025-08-19",
        time24h: "10:00",
        totalStudents: 12,
        totalQuestions: 20,
      },
      snapshot: {
        ts: now,
        avgScore: 72,
        pctCompleted: 58,
        statusDist: { "Not Started": 2, "In Progress": 7, "Completed": 3 },
      },
      students: [
        { id: "1", name: "Alice Johnson", completed: 12, totalQuestions: 20, avgTimeSec: 32, score: 68, status: "In Progress" },
        { id: "2", name: "Bob Lee", completed: 20, totalQuestions: 20, avgTimeSec: 28, score: 85, status: "Completed" },
        { id: "3", name: "Carla P.", completed: 0, totalQuestions: 20, avgTimeSec: 0, score: 0, status: "Not Started" },
        { id: "4", name: "Diego M.", completed: 14, totalQuestions: 20, avgTimeSec: 31, score: 74, status: "In Progress" },
        { id: "5", name: "Elif T.", completed: 16, totalQuestions: 20, avgTimeSec: 29, score: 77, status: "In Progress" },
      ],
    };
    await route.fulfill({ contentType: "application/json", body: JSON.stringify(payload) });
  });
}

export async function mockStudents(page: Page) {
  await page.route("**/api/students**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        students: [
          { id: "1", name: "Alice Johnson", completed: 12, totalQuestions: 20, avgTimeSec: 32, score: 68, status: "In Progress" },
          { id: "2", name: "Bob Lee", completed: 20, totalQuestions: 20, avgTimeSec: 28, score: 85, status: "Completed" },
          { id: "3", name: "Carla P.", completed: 0, totalQuestions: 20, avgTimeSec: 0, score: 0, status: "Not Started" },
          { id: "4", name: "Diego M.", completed: 14, totalQuestions: 20, avgTimeSec: 31, score: 74, status: "In Progress" },
          { id: "5", name: "Elif T.", completed: 16, totalQuestions: 20, avgTimeSec: 29, score: 77, status: "In Progress" },
        ],
      }),
    });
  });
}

export async function mockExams(page: Page) {
  await page.route("**/api/exams**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        exams: [
          {
            id: "ex-1",
            title: "Midterm Algebra",
            subject: "Mathematics",
            startsAt: "2025-08-20T10:00:00.000Z",
            totalStudents: 12,
            totalQuestions: 20,
            completedCount: 7,
            avgScore: 72,
            status: "In Progress",
          },
        ],
      }),
    });
  });
}
