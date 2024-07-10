const router = require('express').Router();


router.use('/auth', require('./auth.route'))
router.use('/user', require('./user.route'))
router.use('/role', require('./role.route'))
router.use('/campus', require('./campus.route'))
router.use('/semester', require('./semester.route'))
router.use('/setting', require('./setting.route'))
router.use('/class', require('./class.route'))
router.use('/ucs', require('./userclasssemester.route'))
router.use('/urs', require('./userrolesemester.route'))
router.use('/project', require('./project.route'))
router.use('/team', require('./team.route'))
router.use('/teamproject', require('./teamProject.route'))
router.use('/fcrqm', require('./functionRequirement.route'))
router.use('/milestone', require('./milestone.route'))
router.use('/iteration', require('./iteration.route'))
router.use('/loc-e', require('./locEvaluation.route'))
router.use('/t-iter-doc', require('./teamIterationDocument.route'))
router.use('/team-e', require('./teamEvaluation.route'))
router.use('/statistic', require('./statistic.route'))
router.use('/noti', require('./notification.route'))
router.use('/download', require('./download.route'))
router.use('/point', require('./point.route'))
router.use('/request', require('./request.route'))
router.use('/final-e', require('./finalEvaluation.route'))
router.use('/import-history', require('./importHistory.route'))
router.use('/chat-group', require('./chatGroup.route'))


module.exports = router;

