import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#3d4db7',
  },
  textsContainer: {
    flex: 1,
    gap: 2,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
  },
  date: {
    color: colors.gray,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    color: colors.gray,
  },
  space: {
    flex: 1,
  },
});

export default styles;
