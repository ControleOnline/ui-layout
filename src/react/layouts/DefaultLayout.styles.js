import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    minHeight: 0,
    minWidth: 0,
    backgroundColor: '#f8f9fa',
  },
  adminToolsContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  desktopHomeLogoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    elevation: 200,
  },
  headerCompanyLogoLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCompanyLogoButton: {
    minWidth: 96,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCompanyLogo: {
    width: 132,
    height: 36,
  },
  headerCompanyLogoFallback: {
    minWidth: 56,
    minHeight: 36,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  headerCompanyLogoInitials: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#0F172A',
  },
  content: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    backgroundColor: '#f8f9fa',
  },
  headerRightContainer: {
    flex: 1,
    minWidth: 0,
    marginLeft: 'auto',
    paddingRight: 16,
    maxWidth: 360,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default styles;
