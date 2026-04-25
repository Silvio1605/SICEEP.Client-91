import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useScreenType = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

    return { isMobile, isTablet, isDesktop, isLarge };
};
