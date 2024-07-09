import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default styles;
