export const api = {
  exams: {
    list: async () => {
      const resp = await fetch('/api/exams');
      return resp.json();
    },
    get: async (id: string) => {
      const resp = await fetch(`/api/exams?id=${id}`);
      return resp.json();
    },
    save: async (data: any) => {
      const resp = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return resp.json();
    },
    toggleActive: async (id: string, isActive: boolean) => {
      const resp = await fetch('/api/exams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive }),
      });
      return resp.json();
    },
    delete: async (id: string) => {
      const resp = await fetch(`/api/exams?id=${id}`, { method: 'DELETE' });
      return resp.json();
    }
  },
  attempts: {
    start: async (examId: string, userId: string) => {
      const resp = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, userId }),
      });
      return resp.json();
    },
    saveAnswer: async (data: { attemptId: string, questionId: string, selectedOption: string | null, isMarkedForReview?: boolean }) => {
      const resp = await fetch('/api/attempts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return resp.json();
    },
    submit: async (id: string) => {
      const resp = await fetch('/api/attempts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      return resp.json();
    },
    get: async (id: string) => {
      const resp = await fetch(`/api/attempts?id=${id}`);
      return resp.json();
    }
  }
};
