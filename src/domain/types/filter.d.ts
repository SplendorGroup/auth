declare namespace Filter {
    interface Pagination<T> {
      total: number;
      page: number;
      pages: number;
      per_page: number;
      in_page: number;
      data: T[];
    };
}