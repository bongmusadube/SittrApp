import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const UploadDocumentComponent = ({ onDocumentSelect }) => {
  const [document, setDocument] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setDocument(result);
      onDocumentSelect(result);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log('Error picking document:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {document && (
        <Text style={styles.documentName}>{document.name}</Text>
      )}
      <Button title="Pick Document" onPress={pickDocument} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  documentName: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default UploadDocumentComponent;
