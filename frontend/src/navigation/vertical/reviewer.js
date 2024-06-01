// ** Icons Import
import { Award, User, Users, BarChart, BookOpen, Circle } from 'react-feather'
export default [

  {
    id: '14',
    title: 'MileStone',
    icon: <BookOpen size={12} />,
    children: [
      {
        id: '15',
        title: 'Iteration Final',
        icon: <Circle size={12} />,
        navLink: '/reviewer/iteration-final'
      },
      {
        id: '16',
        title: 'Iteration Final Resit',
        icon: <Circle size={12} />,
        navLink: '/reviewer/iteration-final-resit'
      }
    ]
  }
]
