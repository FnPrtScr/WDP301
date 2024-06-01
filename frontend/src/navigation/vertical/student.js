// ** Icons Import
import { Award, User, Users, BarChart, BookOpen, Circle } from 'react-feather'
import { ProjectOutlined, PullRequestOutlined } from "@ant-design/icons"
export default [
  {
    id: '17',
    title: 'Project',
    icon: <ProjectOutlined size={12} />,
    navLink: '/student/project'
  },
  {
    id: '18',
    title: 'Team and Lecture',
    icon: <Award size={12} />,
    navLink: '/student/my-team'
  },
  {
    id: '19',
    title: 'Request Topic',
    icon: <PullRequestOutlined size={12} />,
    navLink: '/student/manage-request'
  },
  {
    id: '20',
    title: 'Milestone',
    icon: <User size={12} />,
    children: [
      {
        id: '21',
        title: 'Iteration1',
        icon: <Circle size={12} />,
        navLink: '/student/iteration1'
      },
      {
        id: '22',
        title: 'Iteration2',
        icon: <Circle size={12} />,
        navLink: '/student/iteration2'
      },
      {
        id: '23',
        title: 'Iteration3',
        icon: <Circle size={12} />,
        navLink: '/student/iteration3'
      },
      {
        id: '24',
        title: 'Iteration Final',
        icon: <Circle size={12} />,
        navLink: '/student/iteration-final'
      }
    ]
  },
  {
    id: '25',
    title: 'Mark Report',
    icon: <BookOpen size={12} />,
    navLink: '/student/mark-report'
  }
]
