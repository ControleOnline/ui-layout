export const DEFAULT_BOTTOM_NAVIGATION_HEIGHT = 64;
export const MODERN_DOCK_BOTTOM_NAVIGATION_HEIGHT = 64;

export const shouldShowOperationalBottomNavigation = ({
  appType,
  interactionMode,
  isTotemMode,
} = {}) => {
  if (isTotemMode) {
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

  return normalizedAppType === 'POS'
    ? DEFAULT_BOTTOM_NAVIGATION_HEIGHT
    : MODERN_DOCK_BOTTOM_NAVIGATION_HEIGHT;
};

export const getBottomNavigationOffset = ({
  appType,
  bottomInset = 0,
} = {}) =>
  getBottomNavigationBaseHeight(appType) +
  Math.max(Number(bottomInset) || 0, 10);

export const getOwnedBottomBarOffset = ({
  hasBottomNavigation = false,
  bottomInset = 0,
} = {}) =>
  hasBottomNavigation
    ? 0
    : Math.max(Number(bottomInset) || 0, 0);
