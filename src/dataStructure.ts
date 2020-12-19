import {
    atom,
    selector,
    RecoilState,
    RecoilValueReadOnly,
} from 'recoil';

export interface Recipe {
    label: string,
    ingredients: RecoilState<Ingredient[]>
}

export interface Ingredient {
    id: string,
    label: string,
    quantity: string,
}

export const mealsState:RecoilState<Recipe[]> = atom<Recipe[]>({ key: 'meals', default: [] });

const newRecipe = (key:string, label:string):RecoilState<Recipe> => {
    const defaultR:Recipe = {
        label,
        ingredients:atom<Ingredient[]>({ key:'ingredients-'+key, default: [] })
    };
    return atom<Recipe>({ key, default: defaultR });
}

export const sidelinesStates:RecoilState<Recipe>[] = [
    newRecipe('sideline_breakfast',         'Petit déjeuner'),
    newRecipe('sideline_snack',             'Goutter'),
    newRecipe('sideline_aperitif',          'Apéro'),
    newRecipe('sideline_householdProducts', 'Entretien'),
    newRecipe('sideline_others',            'Autres'),
];

export const allIngredientsSelector:RecoilValueReadOnly<Ingredient[]> = selector<Ingredient[]>({
    key: "allIngredientsSelector",
    get: ({get}) => {
        const slIngredients:Ingredient[] = sidelinesStates.reduce(
            (acc:Ingredient[], slState:RecoilState<Recipe>) => {
                const sl:Recipe = get(slState);
                return [...acc, ...get(sl.ingredients)];
            }, []);
        const mIngredients:Ingredient[] = get(mealsState).reduce(
            (acc:Ingredient[], m:Recipe) => { return [...acc, ...get(m.ingredients)]}, []);
        return [...mIngredients, ...slIngredients];
    }
});

export const uniqueIngredientsSelector:RecoilValueReadOnly<Ingredient[]> = selector<Ingredient[]>({
    key: "uniqueIngredientsSelector",
    get: ({get}) => {
        let obj:any = {};
        const all:Ingredient[] = get(allIngredientsSelector);
        all.forEach((ing:Ingredient) => { obj[ing.id] = ing; });

        return Object.entries(obj).map(
            (pair:any[]) => {
                const value:Ingredient = pair[1];
                return (value)
            });
    }
});

