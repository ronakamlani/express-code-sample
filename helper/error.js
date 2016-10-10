module.exports = {
  errorHandler: function(res,msg) {
    res.render('admin/page_500',msg);
  }
   
};