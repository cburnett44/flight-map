import { isDarkMode } from "./darkModeStore";

export function observeDarkMode() {
    const observer = new MutationObserver(() => {
        const darkMode = document.documentElement.classList.contains('dark');
        isDarkMode.set(darkMode);
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });

    const darkMode = document.documentElement.classList.contains('dark');
    isDarkMode.set(darkMode);
}