// src/components/wash/FeedbackInput.tsx
import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import colors from "../../constants/colors";

export interface FeedbackInputProps {
  /** The current text of the feedback */
  text: string;
  /** Called when user edits the feedback text */
  onChangeText: (newText: string) => void;
  /** Called when user taps “Send Feedback” */
  onSendFeedback: () => void;
}

const FeedbackInput: React.FC<FeedbackInputProps> = ({ text, onChangeText, onSendFeedback }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Help us improve your next wash</Text>
    <Text style={styles.subtitle}>We’re sorry it wasn’t perfect. Let us know what went wrong so we can make it better next time.</Text>

    <TextInput style={styles.textInput} placeholder="Write your feedback here…" placeholderTextColor={colors.gray40} multiline value={text} onChangeText={onChangeText} />

    <TouchableOpacity style={styles.sendButton} onPress={onSendFeedback}>
      <Text style={styles.sendButtonText}>SEND FEEDBACK</Text>
    </TouchableOpacity>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.gray05,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.greenBrand,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray80,
    marginBottom: 24,
  },
  textInput: {
    minHeight: 120,
    backgroundColor: colors.white,
    borderColor: colors.gray20,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    color: colors.gray80,
    marginBottom: 24,
  },
  sendButton: {
    backgroundColor: colors.greenBrand,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FeedbackInput;

//how to use it
// export default function MyScreen() {
//   const [feedbackText, setFeedbackText] = useState('');

//   const handleSendFeedback = () => {
//     // ...
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {/* any header or other content */}
//       <FeedbackInput
//         text={feedbackText}
//         onChangeText={setFeedbackText}
//         onSendFeedback={handleSendFeedback}
//       />
//     </View>
//   );
// }
