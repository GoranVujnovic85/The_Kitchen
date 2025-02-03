/*=============================================================================================================*/
/*------ Role-based access control (RBAC) – Currently, all users have a role field, but the application -------*/
/*--------- does not know what it means. Authorization should be implemented in controllers so that: ----------*/
/*------------------------- A customer can only create an Order and see their orders. -------------------------*/
/*-------------------------------- Admin can see and edit all orders and users. -------------------------------*/
/*=============================================================================================================*/

module.exports = {
    isCustomer: (req, res, next) => {
      if (req.user && req.user.role === 'customer') {
        return next();
      }
      return res.status(403).json({ message: 'Forbidden: Customers only.' });
    },
  
    isAdmin: (req, res, next) => {
      if (req.user && req.user.role === 'admin') {
        return next();
      }
      return res.status(403).json({ message: 'Forbidden: Admins only.' });
    }
};