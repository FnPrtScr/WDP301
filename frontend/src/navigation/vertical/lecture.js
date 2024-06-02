// ** Icons Import
import { Award, User, Users, BarChart, Circle, Percent } from 'react-feather'
import { ProjectOutlined, PullRequestOutlined } from "@ant-design/icons"
// Lấy dữ liệu từ localStorage

export default [
  {
    id: '7',
    title: 'Classes',
    icon: <Award size={12} />,
    navLink: '/lecture/class-manage'
  },
  {
    id: '8',
    title: 'Project',
    icon: <ProjectOutlined size={12} />,
    navLink: '/lecture/project-manage'
  },
  {
    id: '9',
    title: 'Request Topic',
    icon: <PullRequestOutlined size={12} />,
    navLink: '/lecture/student-request'
  },
  {
    id: '10',
    title: 'MileStone',
    icon: <Users size={12} />,
    children: [
      {
        id: '11',
        title: 'Iteration1',
        icon: <Circle size={12} />,
        navLink: '/lecture/iteration1'
      }, {
        id: '12',
        title: 'Iteration2',
        icon: <Circle size={12} />,
        navLink: '/lecture/iteration2'
      }, {
        id: '13',
        title: 'Iteration3',
        icon: <Circle size={12} />,
        navLink: '/lecture/iteration3'
      }
    ]
  },
  {
    id: '14',
    title: 'Mark Report',
    icon: <Percent size={12} />,
    navLink: '/lecture/mark-report'
  }
]
