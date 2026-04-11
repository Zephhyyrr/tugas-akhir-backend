export const getPagination = (page: number, limit: number) => {
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 10;
    
    const skip = (pageNumber - 1) * pageSize;
    const take = pageSize;

    return { skip, take, pageNumber, pageSize };
};

export const getPagingData = (totalItems: number, page: number, limit: number) => {
    const totalPages = Math.ceil(totalItems / limit);

    return { 
        totalItems, 
        totalPages, 
        currentPage: page,
        perPage: limit
    };
};