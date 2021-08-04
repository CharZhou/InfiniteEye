module.exports = () => async (ctx, next) => {
  ctx.state.paginationParam = {};

  if (ctx.request.query.pagenum && ctx.request.query.pagesize) {
    const pageNum = parseInt(ctx.request.query.pagenum);
    const pageSize = parseInt(ctx.request.query.pagesize);
    ctx.state.paginationParam = {
      enablePagination: true,
      offset: pageSize * Math.max(0, (pageNum - 1)),
      rows: pageSize,
    };
  }

  await next();

  const paginationParam = ctx.state.paginationParam;
  if (paginationParam.enablePagination) {
    const rawDataListLength = ctx.body.length;
    ctx.body = ctx.body.splice(paginationParam.offset, Math.min(paginationParam.rows, rawDataListLength - paginationParam.offset));
    ctx.state.outterBody.total = rawDataListLength;
  }
};
