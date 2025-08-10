import { useState, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export function useScrollNavbar() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
    
    if (scrollDirection === 'down' && currentScrollY > 100) {
      setIsVisible(false);
    } else if (scrollDirection === 'up' || currentScrollY < 50) {
      setIsVisible(true);
    }
    
    lastScrollY.current = currentScrollY;
  };

  return { isVisible, handleScroll };
}