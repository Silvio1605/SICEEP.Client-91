import { getUbicaciones } from './../services/ubicacionServices';
import { useGenericFetch } from './useGenericFetch';

export const useUbicaciones = (initialParam = "", initialPage = 1) =>
    useGenericFetch(getUbicaciones, initialParam, initialPage)
