import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;


export interface Category {
    id: string;
    name: string;
}

export interface GetCategoriesData {
    categories: Category[];
}
