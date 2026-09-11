const patientData = {
  patient: {
    id: "P001",
    name: "Asha",
    age: 72,
    caregiver: "Sarah Jenkins",
  },

  reminders: [
    {
      id: 1,
      title: "Morning Medicine",
      type: "Medicine",
      time: "08:00",
      status: "pending",
      description: "Take 1 tablet after breakfast",
    },
    {
      id: 2,
      title: "Drink Water",
      type: "Hydration",
      time: "10:00",
      status: "pending",
      description: "Drink one glass of water",
    },
    {
      id: 3,
      title: "Afternoon Medicine",
      type: "Medicine",
      time: "14:00",
      status: "pending",
      description: "Take 1 tablet after lunch",
    },
  ],

  memories: [
    {
      id: 1,
      name: "Priya",
      relation: "Daughter",
    },
    {
      id: 2,
      name: "Rahul",
      relation: "Son",
    },
  ],

  mood: {
    current: "Happy",
    lastUpdated: "Today",
  },

  recentGameResults: [],
};

export default patientData;