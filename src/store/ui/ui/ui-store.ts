import { create } from 'zustand';

interface State {
    isSideMenuOpen: boolean;
    openSideMenu: () => void;
    closeSideMenu: () => void;

    isSubscriptionFilterOpen: boolean;
    openSubscriptionFilter: () => void;
    closeSubscriptionFilter: () => void;

    isClientFilterOpen: boolean;
    openClientFilter: () => void;
    closeClientFilter: () => void;
}

export const useUIStore = create<State>()((set) => ({
    isSideMenuOpen: false,
    openSideMenu: () => set({ isSideMenuOpen: true }),
    closeSideMenu: () => set({ isSideMenuOpen: false }),

    isSubscriptionFilterOpen: false,
    openSubscriptionFilter: () => set({ isSubscriptionFilterOpen: true }),
    closeSubscriptionFilter: () => set({ isSubscriptionFilterOpen: false }),

    isClientFilterOpen: false,
    openClientFilter: () => set({ isClientFilterOpen: true }),
    closeClientFilter: () => set({ isClientFilterOpen: false }),
}))