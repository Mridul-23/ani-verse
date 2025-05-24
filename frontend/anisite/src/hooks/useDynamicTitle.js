import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useDynamicTitle = ({
  defaultTitle
}) => {
  const location = useLocation();

  const routeTitles = {
    "/": "Home • ANIVERSE",
    "/about": "About Us • ANIVERSE",
    "/search": "Search • ANIVERSE",
    "/profile": "Your Profile • ANIVERSE",
    "/contact": "Contact Us • ANIVERSE",
    "/explore": "Explore Anime • ANIVERSE",
    "/auth/register": "Register • ANIVERSE",
    "/auth/login": "Login - ANIVERSE",
    "/recommendation": "Recommendations • ANIVERSE",
    "/recommendation/start": "Get Recommendations • ANIVERSE",
    "/recommendation/init": "Initialization • ANIVERSE",
    "/anime/details/:id": "Anime Details • ANIVERSE",
    "*": "404 Not Found • ANIVERSE",
  };

  useEffect(() => {
    const currentPath = location.pathname;

    const matchedRoute = Object.keys(routeTitles).find((route) => {
      // Handle dynamic routes like /anime/details/:id
      if (route.includes(":")) {
        const dynamicPattern = new RegExp(
          `^${route.replace(/:\w+/g, "[^/]+")}$`
        );
        return dynamicPattern.test(currentPath);
      }
      return route === currentPath;
    });

    document.title = routeTitles[matchedRoute] || defaultTitle;
  }, [location.pathname]);
};

export default useDynamicTitle;
