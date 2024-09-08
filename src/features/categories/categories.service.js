import { Categories } from '../../common/data/entities/category/categories.entity.js';
import { paginationWrapper } from '../../common/data/pagination.wrapper.js';

export const listCategories = (pagination = {}) => {
  const { offset, limit, page } = pagination;

  return paginationWrapper(() => Categories, {
    offset,
    limit,
    page
  });
};
