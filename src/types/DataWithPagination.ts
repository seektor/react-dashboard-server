import { PaginationData } from "./PaginationData";

export interface DataWithPagination<T> {
  data: T;
  pagination: PaginationData;
}
