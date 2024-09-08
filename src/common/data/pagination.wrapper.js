export const paginationWrapper = async (entityFn, options) => {
  const { where = {}, limit, offset, page } = options;

  const entity = entityFn();

  const total = await entity.count({
    where
  });

  const data = await entity.findAll(options);

  return {
    total,
    page,
    limit,
    offset,
    data
  };
};
