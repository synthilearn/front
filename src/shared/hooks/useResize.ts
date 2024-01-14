import {useEffect, useState} from 'react';
import {ScreenBreakpoints} from '../enums';

export const useResize = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return {
        isScreen360: width >= ScreenBreakpoints.SCREEN_360,
        isScreen576: width >= ScreenBreakpoints.SCREEN_576,
        isScreen768: width >= ScreenBreakpoints.SCREEN_768,
        isScreen992: width >= ScreenBreakpoints.SCREEN_992,
        isScreen1200: width >= ScreenBreakpoints.SCREEN_1200,
        isScreen1366: width >= ScreenBreakpoints.SCREEN_1366,
        isScreen1440: width > ScreenBreakpoints.SCREEN_1440,
        isScreen1536: width >= ScreenBreakpoints.SCREEN_1536,
    };
};
