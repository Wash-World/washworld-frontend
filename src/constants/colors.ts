const colors = {
  // Base
  white: "#FFFFFF",
  black: "#000000",

  // Brand
  greenBrand: "#06C167", // default green, on white bg (active)
  greenBrandDark: "#0CE578", // green on dark bg (active)
  greenLight: "#A4EBC4", // light green (inactive/disabled)
  greenTint: "#D7FAE5", // / very light green - background hint

  // Grays
  gray80: "#333333", // 80%
  gray60: "#666666", // 60%
  gray10: "#E5E5E5", // 10%
  gray05: "#F7F7F7", // 5%

  // Accents
  orange: "#FF6B06", // splash  orange(brand)
  error: "#FF3B30", // red error
};

/**
 * How to use these colors in a React Native component:
 *
 * import colors from '@/constants/colors'; // if you're using absolute imports
 * // or: import colors from '../../constants/colors';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: colors.white,
 *   },
 *   title: {
 *     color: colors.gray80,
 *     fontWeight: 'bold',
 *   },
 *   primaryButton: {
 *     backgroundColor: colors.green,
 *   },
 *   disabledButton: {
 *     backgroundColor: colors.greenLight,
 *   },
 *   errorText: {
 *     color: colors.error,
 *   },
 * });
 */
