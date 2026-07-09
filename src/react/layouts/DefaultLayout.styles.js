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
