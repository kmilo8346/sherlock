import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  label: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    fontWeight: 'bold',
  },
  indicator: {
    height: 3,
    backgroundColor: colors.blue,
    borderRadius: 10,
  },
});

export default styles;
