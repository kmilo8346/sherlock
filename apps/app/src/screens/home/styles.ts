import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  topicsScrollView: {
    paddingHorizontal: 10,
    marginTop: 5,
    minHeight: 36,
  },
});

export default styles;
