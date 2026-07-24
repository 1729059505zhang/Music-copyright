const Router = require('koa-router');
const AuthController = require('../../../controllers/auth.controller');
const WorkController = require('../../../controllers/work.controller');
const CreatorWorkController = require('../../../controllers/creator.work.controller');
const OrderController = require('../../../controllers/order.controller');
const FinanceController = require('../../../controllers/finance.controller');
const CopyrightController = require('../../../controllers/copyright.controller');
const MessageController = require('../../../controllers/message.controller');
const UploadController = require('../../../controllers/upload.controller');
const { authMiddleware, optionalAuthMiddleware } = require('../../../middleware/auth');

const router = new Router({ prefix: '/api/v1' });

router.get('/public/health', async (ctx) => {
  ctx.body = { code: 0, message: 'ok', data: { status: 'running' } };
});

router.post('/auth/register', AuthController.register);
router.post('/auth/creator-register', AuthController.creatorRegister);
router.post('/auth/login', AuthController.login);
router.get('/auth/userinfo', authMiddleware, AuthController.getCurrentUser);
router.put('/auth/password', authMiddleware, AuthController.changePassword);

router.get('/works', optionalAuthMiddleware, WorkController.getWorkList);
router.get('/works/:id', optionalAuthMiddleware, WorkController.getWorkDetail);
router.post('/works/favorite', authMiddleware, WorkController.toggleFavorite);
router.get('/favorites', authMiddleware, WorkController.getFavoriteList);
router.post('/inquiry', authMiddleware, WorkController.createInquiry);
router.get('/inquiries', authMiddleware, WorkController.getInquiryList);

router.get('/creator/works', authMiddleware, CreatorWorkController.getMyWorks);
router.get('/creator/works/:id', authMiddleware, CreatorWorkController.getWorkDetail);
router.post('/creator/works', authMiddleware, CreatorWorkController.createWork);
router.put('/creator/works/:id', authMiddleware, CreatorWorkController.updateWork);
router.delete('/creator/works/:id', authMiddleware, CreatorWorkController.deleteWork);
router.put('/creator/works/:id/status', authMiddleware, CreatorWorkController.toggleWorkStatus);

router.post('/orders', authMiddleware, OrderController.createOrder);
router.post('/orders/pay', authMiddleware, OrderController.payOrder);
router.get('/orders', authMiddleware, OrderController.getMyOrders);
router.get('/orders/:id', authMiddleware, OrderController.getOrderDetail);
router.put('/orders/:id/cancel', authMiddleware, OrderController.cancelOrder);

router.get('/finance/balance', authMiddleware, FinanceController.getBalance);
router.get('/finance/earnings', authMiddleware, FinanceController.getEarningsOverview);
router.get('/finance/sales', authMiddleware, FinanceController.getSalesFlow);
router.post('/finance/withdrawal', authMiddleware, FinanceController.applyWithdrawal);
router.get('/finance/withdrawals', authMiddleware, FinanceController.getWithdrawalList);
router.get('/finance/payment-account', authMiddleware, FinanceController.getPaymentAccount);
router.put('/finance/payment-account', authMiddleware, FinanceController.updatePaymentAccount);

router.post('/copyright/apply', authMiddleware, CopyrightController.createApply);
router.get('/copyright/applications', authMiddleware, CopyrightController.getMyApplyList);
router.get('/copyright/applications/:id', authMiddleware, CopyrightController.getApplyDetail);
router.get('/copyright/certificates', authMiddleware, CopyrightController.getMyCertificates);

router.get('/messages', authMiddleware, MessageController.getMessageList);
router.get('/messages/unread-count', authMiddleware, MessageController.getUnreadCount);
router.put('/messages/:id/read', authMiddleware, MessageController.markAsRead);
router.put('/messages/read-all', authMiddleware, MessageController.markAllAsRead);
router.delete('/messages/:id', authMiddleware, MessageController.deleteMessage);

router.post('/upload/image', authMiddleware, UploadController.uploadImage);
router.post('/upload/audio', authMiddleware, UploadController.uploadAudio);
router.post('/upload/doc', authMiddleware, UploadController.uploadDoc);

module.exports = router;
