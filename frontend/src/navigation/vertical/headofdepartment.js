// ** Icons Import
import { Award, User, Users, BarChart, BookOpen, Settings } from 'react-feather'
export default [
    {
        id: '1',
        title: 'Statistic',
        icon: <BarChart size={12} />,
        navLink: '/head-of-department/dashboard'
    },
    {
        id: '2',
        title: 'Semester',
        icon: <Award size={12} />,
        navLink: '/head-of-department/semester'
    },

    {
        id: '3',
        title: 'Classes',
        icon: <Users size={12} />,
        navLink: '/head-of-department/classes'
    },
    {
        id: '4',
        title: 'Lecture',
        icon: <User size={12} />,
        navLink: '/head-of-department/lecture'
    },
    {
        id: '5',
        title: 'Mark Report',
        icon: <BookOpen size={12} />,
        navLink: '/head-of-department/mark-report'
    },
    {
        id: '6',
        title: 'Setting',
        icon: <Settings size={12} />,
        navLink: '/head-of-department/setting'
    }
]
