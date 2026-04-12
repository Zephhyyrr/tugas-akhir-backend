export const getPagination = (page: number, limit: number) => {
    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 10, 1);
    
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    return { skip, take, pageNumber, pageSize };
};

export const getPagingData = (totalItems: number, page: number, limit: number) => {
    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 10, 1);
    const totalPages = Math.ceil(totalItems / pageSize);

    return { 
        totalItems, 
        totalPages, 
        currentPage: pageNumber,
        perPage: pageSize,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1
    };
};