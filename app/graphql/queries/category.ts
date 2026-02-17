import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
    }
  }
`;

export const GET_CATEGORY_WITH_PRODUCTS = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
      products {
        id
        name
        description
        price
        image
        category {
          name
        }
      }
    }
  }
`;

export interface Category {
  id: string;
  name: string;
  products?: any[];
}

export interface GetCategoriesData {
  categories: Category[];
}

export interface GetCategoryData {
  category: Category;
}
