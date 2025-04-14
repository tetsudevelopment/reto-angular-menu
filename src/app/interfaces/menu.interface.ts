export interface Dish {
  id: number;
  title: string;
  image: string;
  summary: string;
  readyInMinutes: number;
  servings: number;
  vegan: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  healthScore: number;
  pricePerServing: number;
}

export interface MenuStats {
  dishes: number;
  vegan: number;
  nonVegan: number;
  pricePerServing: number;
  readyInMinutes: number;
  healthScore: number;
}