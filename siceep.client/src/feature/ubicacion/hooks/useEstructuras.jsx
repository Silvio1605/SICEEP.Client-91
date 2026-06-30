import { getEstructuras } from './../services/ubicacionServices';
import { useGenericFetch } from './useGenericFetch';

export const useEstructuras = (initialParam = "", initialPage = 1) =>
    useGenericFetch(getEstructuras, initialParam, initialPage);
