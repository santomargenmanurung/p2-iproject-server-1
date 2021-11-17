const getPagination = (page, size) => {
  const limit = size ? Number(size) : 10;
  page--;
  const offset = page ? page * limit : 0;

  return {
    limit,
    offset,
  };
};

const pagingData = (data, page, limit) => {
  const { count: totalItems, rows: events } = data;
  const currentPage = page ? Number(page) : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    events,
    totalPages,
    currentPage,
  };
};

module.exports = {
  getPagination,
  pagingData,
};
