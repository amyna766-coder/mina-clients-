
export interface Customer {
  id: string;
  name: string;
  pageNumber: string;
  familyCount: number;
  secretPin: string;
  createdAt: number;
}

export enum SortType {
  ALPHABETICAL = 'ALPHABETICAL',
  FAMILY_COUNT = 'FAMILY_COUNT',
  LATEST = 'LATEST'
}
