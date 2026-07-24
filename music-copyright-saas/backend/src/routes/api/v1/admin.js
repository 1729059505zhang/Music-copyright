const Router = require('koa-router');
const AdminAuthController = require('../../../controllers/admin.auth.controller');
const AdminDashboardController = require('../../../controllers/admin.dashboard.controller');
const AdminWorkController = require('../../../controllers/admin.work.controller');
const { AdminUserController, AdminTenantController } = require('../../../controllers/admin.user.controller');
const { AdminOrderController, AdminFinanceController } = require('../../../controllers/admin.order.controller');
const AdminCopyrightController = require('../../../controllers/admin.copyright.controller');
const { AdminSystemController, AdminCategoryController } = require('../../../controllers/admin.system.controller');
const { adminAuthMiddleware } = require('../../../middleware/auth');

const router = new Router({ prefix: '/api/v1/admin' });

router.post('/auth/login', AdminAuthController.login);
router.get('/auth/userinfo', adminAuthMiddleware, AdminAuthController.getCurrentAdmin);
router.get('/auth/menus', adminAuthMiddleware, AdminAuthController.getMenus);
router.put('/auth/password', adminAuthMiddleware, AdminAuthController.changePassword);

router.get('/dashboard/stats', adminAuthMiddleware, AdminDashboardController.getDashboardStats);
router.get('/dashboard/order-trend', adminAuthMiddleware, AdminDashboardController.getOrderTrend);

router.get('/users', adminAuthMiddleware, AdminUserController.getUserList);
router.get('/users/:id', adminAuthMiddleware, AdminUserController.getUserDetail);
router.put('/users/:id/status', adminAuthMiddleware, AdminUserController.toggleUserStatus);
router.put('/users/:id/reset-password', adminAuthMiddleware, AdminUserController.resetUserPassword);
router.put('/users/:id/audit-realname', adminAuthMiddleware, AdminUserController.auditRealName);

router.get('/creators', adminAuthMiddleware, AdminUserController.getCreatorList);
router.put('/creators/:id/audit', adminAuthMiddleware, AdminUserController.auditCreator);

router.get('/works', adminAuthMiddleware, AdminWorkController.getWorkList);
router.get('/works/:id', adminAuthMiddleware, AdminWorkController.getWorkDetail);
router.put('/works/:id/audit', adminAuthMiddleware, AdminWorkController.auditWork);
router.put('/works/:id/status', adminAuthMiddleware, AdminWorkController.toggleWorkStatus);
router.delete('/works/:id', adminAuthMiddleware, AdminWorkController.deleteWork);

router.get('/categories', adminAuthMiddleware, AdminCategoryController.getCategoryList);
router.post('/categories', adminAuthMiddleware, AdminCategoryController.createCategory);
router.put('/categories/:id', adminAuthMiddleware, AdminCategoryController.updateCategory);
router.delete('/categories/:id', adminAuthMiddleware, AdminCategoryController.deleteCategory);

router.get('/orders', adminAuthMiddleware, AdminOrderController.getOrderList);
router.get('/orders/:id', adminAuthMiddleware, AdminOrderController.getOrderDetail);
router.post('/orders/:id/refund', adminAuthMiddleware, AdminOrderController.refundOrder);

router.get('/copyright/applications', adminAuthMiddleware, AdminCopyrightController.getApplyList);
router.get('/copyright/applications/:id', adminAuthMiddleware, AdminCopyrightController.getApplyDetail);
router.put('/copyright/applications/:id/audit', adminAuthMiddleware, AdminCopyrightController.auditApply);
router.get('/copyright/certificates', adminAuthMiddleware, AdminCopyrightController.getCertificateList);
router.post('/copyright/certificates/:id/reissue', adminAuthMiddleware, AdminCopyrightController.reissueCertificate);

router.get('/copyright/release-works', adminAuthMiddleware, AdminCopyrightController.getReleaseWorkList);
router.put('/copyright/release-works/:id/audit', adminAuthMiddleware, AdminCopyrightController.auditReleaseWork);

router.get('/finance/withdrawals', adminAuthMiddleware, AdminFinanceController.getWithdrawalList);
router.put('/finance/withdrawals/:id/audit', adminAuthMiddleware, AdminFinanceController.auditWithdrawal);
router.get('/finance/settlements', adminAuthMiddleware, AdminFinanceController.getSettlementList);
router.get('/finance/flows', adminAuthMiddleware, AdminFinanceController.getFinancialFlow);

router.get('/tenants', adminAuthMiddleware, AdminTenantController.getTenantList);
router.get('/tenants/:id', adminAuthMiddleware, AdminTenantController.getTenantDetail);
router.post('/tenants', adminAuthMiddleware, AdminTenantController.createTenant);
router.put('/tenants/:id', adminAuthMiddleware, AdminTenantController.updateTenant);

router.get('/system/admins', adminAuthMiddleware, AdminSystemController.getAdminList);
router.post('/system/admins', adminAuthMiddleware, AdminSystemController.createAdmin);
router.put('/system/admins/:id', adminAuthMiddleware, AdminSystemController.updateAdmin);
router.put('/system/admins/:id/reset-password', adminAuthMiddleware, AdminSystemController.resetAdminPassword);

router.get('/system/roles', adminAuthMiddleware, AdminSystemController.getRoleList);
router.post('/system/roles', adminAuthMiddleware, AdminSystemController.createRole);
router.get('/system/roles/:roleId/permissions', adminAuthMiddleware, AdminSystemController.getRolePermissions);
router.put('/system/roles/:roleId/permissions', adminAuthMiddleware, AdminSystemController.assignRolePermissions);

router.get('/system/permissions', adminAuthMiddleware, AdminSystemController.getPermissionTree);

router.get('/system/config', adminAuthMiddleware, AdminSystemController.getSystemConfig);
router.put('/system/config', adminAuthMiddleware, AdminSystemController.updateSystemConfig);

router.get('/system/third-apis', adminAuthMiddleware, AdminSystemController.getThirdApiList);
router.post('/system/third-apis', adminAuthMiddleware, AdminSystemController.createThirdApi);
router.put('/system/third-apis/:id', adminAuthMiddleware, AdminSystemController.updateThirdApi);
router.delete('/system/third-apis/:id', adminAuthMiddleware, AdminSystemController.deleteThirdApi);

router.get('/system/logs', adminAuthMiddleware, AdminSystemController.getOperationLogs);

module.exports = router;
