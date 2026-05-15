export const DEFAULT_BOTTOM_NAVIGATION_HEIGHT = 62;
export const MODERN_DOCK_BOTTOM_NAVIGATION_HEIGHT = 86;

export const shouldShowOperationalBottomNavigation = ({
  appType,
  interactionMode,
  isKioskMode,
} = {}) => {
  if (isKioskMode) {
    return false;
  }

  const normalizedAppType = String(appType || '').trim().toUpperCase();
  const normalizedInteractionMode = String(interactionMode || '')
    .trim()
    .toLowerCase();

  return normalizedAppType === 'POS' || normalizedInteractionMode === 'pdv';
};

export const getBottomNavigationBaseHeight = appType => {
  const normalizedAppType = String(appType || '').trim().toUpperCase();

  return normalizedAppType === 'MANAGER' || normalizedAppType === 'PPC'
    ? MODERN_DOCK_BOTTOM_NAVIGATION_HEIGHT
    : DEFAULT_BOTTOM_NAVIGATION_HEIGHT;
};

export const getBottomNavigationOffset = ({
  appType,
  bottomInset = 0,
} = {}) =>
  getBottomNavigationBaseHeight(appType) +
  Math.max(Number(bottomInset) || 0, 8);

export const getOwnedBottomBarOffset = ({
  hasBottomNavigation = false,
  bottomInset = 0,
} = {}) =>
  hasBottomNavigation
    ? 0
    : Math.max(Number(bottomInset) || 0, 0);
