const express = require('express');
const Metric = require('../models/Metric');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get aggregated metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalRequests = await Metric.countDocuments();
    const successRequests = await Metric.countDocuments({ status: 'success' });
    const errorRequests = await Metric.countDocuments({ status: 'error' });
    
    // Aggregate data for charts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyUsage = await Metric.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          requests: { $sum: 1 },
          cost: { $sum: "$cost" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const activeUsers = await Metric.distinct('user', { createdAt: { $gte: sevenDaysAgo } });
    
    const performance = await Metric.aggregate([
      { $match: { status: 'success' } },
      {
        $group: {
          _id: null,
          avgLatency: { $avg: "$latency" },
          totalTokens: { $sum: "$totalTokens" },
          totalCost: { $sum: "$cost" }
        }
      }
    ]);

    const endpointUsage = await Metric.aggregate([
      {
        $group: {
          _id: "$endpoint",
          count: { $sum: 1 }
        }
      }
    ]);

    const recentLogs = await Metric.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      summary: {
        totalRequests,
        successRate: totalRequests > 0 ? (successRequests / totalRequests) * 100 : 0,
        activeUsers: activeUsers.length,
        totalCost: performance[0]?.totalCost || 0,
        avgLatency: performance[0]?.avgLatency || 0,
        totalTokens: performance[0]?.totalTokens || 0
      },
      dailyUsage,
      endpointUsage,
      recentLogs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
