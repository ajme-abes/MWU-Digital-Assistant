import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  courses: [],
  setUser: (user) => set({ user }),
  setCourses: (courses) => set({ courses }),
}));

export default useStore;