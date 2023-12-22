// export const homeObjOne = {
//   lightBg: false,
//   lightText: true,
//   lightTextDesc: true,
//   topLine: 'Task Management',
//   headline: 'Effortless Todo Tracking',
//   description:
//     'Organize your day with our intuitive todo app. Easily manage tasks and stay on top of your schedule with just a few clicks.',
//   buttonLabel: 'Get Started',
//   imgStart: '',
//   img: 'images/svg-1.svg',
//   alt: 'Task Management'
// };

// export const homeObjTwo = {
//   lightBg: false,
//   lightText: true,
//   lightTextDesc: true,
//   topLine: 'Priority System',
//   headline: 'Prioritize Your Tasks',
//   description:
//     'Assign priorities to your tasks and focus on what matters most. Our app helps you efficiently manage your workload.',
//   buttonLabel: 'Learn More',
//   imgStart: '',
//   img: 'images/svg-5.svg',
//   alt: 'Priority System'
// };

// export const homeObjThree = {
//   lightBg: true,
//   lightText: false,
//   lightTextDesc: false,
//   topLine: 'User-Friendly Interface',
//   headline: 'Simple Onboarding and Usage',
//   description:
//     'Experience a hassle-free onboarding process. Start organizing your tasks in minutes by adding your information effortlessly.',
//   buttonLabel: 'Start Now',
//   imgStart: 'start',
//   img: 'images/svg-7.svg',
//   alt: 'User-Friendly Interface'
// };

// export const homeObjFour = {
//   lightBg: false,
//   lightText: true,
//   lightTextDesc: true,
//   topLine: 'Data Insights',
//   headline: 'Track Your Progress',
//   description:
//     'All your task data is securely stored in the cloud. Analyze your progress and make informed decisions about your productivity.',
//   buttonLabel: 'Sign Up Now',
//   imgStart: 'start',
//   img: 'images/svg-8.svg',
//   alt: 'Data Insights'
// };
interface HomeObject {
  lightBg: boolean;
  lightText: boolean;
  lightTextDesc: boolean;
  topLine: string;
  headline: string;
  description: string;
  buttonLabel: string;
  imgStart?: string; // Optional property
  img: string;
  alt: string;
}

export const homeObjOne: HomeObject = {
  lightBg: false,
  lightText: true,
  lightTextDesc: true,
  topLine: 'Task Management',
  headline: 'Effortless Todo Tracking',
  description:
    'Organize your day with our intuitive todo app. Easily manage tasks and stay on top of your schedule with just a few clicks.',
  buttonLabel: 'Get Started',
  imgStart: '',
  img: 'images/svg-1.svg',
  alt: 'Task Management',
};

export const homeObjTwo: HomeObject = {
  lightBg: false,
  lightText: true,
  lightTextDesc: true,
  topLine: 'Priority System',
  headline: 'Prioritize Your Tasks',
  description:
    'Assign priorities to your tasks and focus on what matters most. Our app helps you efficiently manage your workload.',
  buttonLabel: 'Learn More',
  imgStart: '',
  img: 'images/svg-5.svg',
  alt: 'Priority System',
};

export const homeObjThree: HomeObject = {
  lightBg: true,
  lightText: false,
  lightTextDesc: false,
  topLine: 'User-Friendly Interface',
  headline: 'Simple Onboarding and Usage',
  description:
    'Experience a hassle-free onboarding process. Start organizing your tasks in minutes by adding your information effortlessly.',
  buttonLabel: 'Start Now',
  imgStart: 'start',
  img: 'images/svg-7.svg',
  alt: 'User-Friendly Interface',
};

export const homeObjFour: HomeObject = {
  lightBg: false,
  lightText: true,
  lightTextDesc: true,
  topLine: 'Data Insights',
  headline: 'Track Your Progress',
  description:
    'All your task data is securely stored in the cloud. Analyze your progress and make informed decisions about your productivity.',
  buttonLabel: 'Sign Up Now',
  imgStart: 'start',
  img: 'images/svg-8.svg',
  alt: 'Data Insights',
};
