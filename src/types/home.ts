import { Member } from './member';
import { Funding } from './funding';
import { Product } from './product';

export interface HomeData {
    member: Member | null;
    myFundings: Funding[];
    popularProducts: Product[];
    recommendedProducts?: Product[];
    hotProducts?: Product[];
}
