import MaterialIcons  from "@expo/vector-icons/MaterialIcons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";

type Song = {
  name: string;
  uri: string;
};

const Index = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const router = useRouter();

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      multiple: true,
    });

    if (!result.canceled) {
      const files = result.assets.map((file) => ({
        name: file.name,
        uri: file.uri,
      }));

      setSongs(files);
    }
  };

  const formatSongName = (name: string) => {
    return name.replace(/\.[^/.]+$/, '').substring(0, 40);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="music-note" size={32} color="#6366f1" />
        <Text style={styles.headerTitle}>My Playlist</Text>
        <Text style={styles.headerSubtitle}>
          {songs.length} song{songs.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={pickAudio}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add-circle" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add Music</Text>
      </TouchableOpacity>

      {songs.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="music-note" size={64} color="#d1d5db" /> 
          <Text style={styles.emptyText}>No songs yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the button above to add your favorite songs
          </Text>
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.songItem}
              onPress={() =>
                router.push({
                  pathname: '/player',
                  params: {
                    index: index.toString(),
                    songs: JSON.stringify(songs),
                  },
                })
              }
              activeOpacity={0.7}
            >
              <View style={styles.songIcon}>
                <MaterialIcons name="music-note" size={24} color="#6366f1" />
              </View>
              <View style={styles.songInfo}>
                <Text style={styles.songName} numberOfLines={1}>
                  {formatSongName(item.name)}
                </Text>
                <Text style={styles.songIndex}>Track {index + 1}</Text>
              </View>
              <MaterialIcons
                name="play-circle-filled"
                size={28}
                color="#6366f1"
              />
            </TouchableOpacity>
          )}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
        />

      )}
    </View>
  );
}

export default Index;

const styles = StyleSheet.create({
  container: {  
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#f9fafb',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  songItem: {
    flexDirection: 'row',  
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  songIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  songIndex: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
});