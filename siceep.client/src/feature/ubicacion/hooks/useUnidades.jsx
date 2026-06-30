import { getUnidades } from './../services/ubicacionServices';
import { useGenericFetch } from './useGenericFetch';

export const useUnidades = (initialParam = "", initialPage = 1) =>
    useGenericFetch(getUnidades, initialParam, initialPage);