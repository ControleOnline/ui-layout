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
    minWidth: 48,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
  },
  headerCompanyLogoInitials: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
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
