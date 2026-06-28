import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Text, Button, FlatList, StyleSheet,  TouchableOpacity} from "react-native";
import Slider from "@react-native-community/slider";
import  { useAudioPlayer, useAudioPlayerStatus} from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Song = {
  name: string;
  uri: string;
}

const Player = () => {
  const { index, songs } = useLocalSearchParams();
  const router = useRouter();
  const parsedSongs: Song[] = JSON.parse(songs as string);

  const [currentIndex, setCurrentIndex] = useState(Number(index));
  const currentSong = parsedSongs[currentIndex];

  const player = useAudioPlayer(currentSong.uri);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    player.replace(currentSong.uri);
    player.play();
  }, [currentIndex]);

  const togglePlayPause = async () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const nextSong = () => {
    setCurrentIndex((prev) => (prev === parsedSongs.length - 1 ? 0 : prev + 1));
  };

  const prevSong = () => {
    setCurrentIndex((prev) => (prev === 0 ? parsedSongs.length - 1 : prev - 1));
  };

  const seekAudio = async (value: number) => {
    await player.seekTo(value);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatSongName = (name: string) => {
    return name.replace(/\.[^/.]+$/, "");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.albumArtContainer}>
        <View style={styles.albumArt}>
          <MaterialIcons name="music-note" size={80} color="#6366f1" />
        </View>
      </View>

      <View style={styles.songDetailsContainer}>
        <Text style={styles.songTitle} numberOfLines={2}>
          {formatSongName(currentSong.name)}
        </Text>
        <Text style={styles.trackNumber}>
          Track {currentIndex + 1} of {parsedSongs.length}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={status.duration || 1}
          value={status.currentTime || 0}
          onSlidingComplete={seekAudio}
          minimumTrackTintColor="#6366f1"
          maximumTrackTintColor="#e5e7eb"
          thumbTintColor="#6366f1"
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(status.currentTime || 0)}
          </Text>
          <Text style={styles.timeText}>
            {formatTime(status.duration || 0)}
          </Text>
        </View>
      </View>
      <View style={styles.controlsContainer}>  
        <TouchableOpacity
          style={styles.controlButton}
          onPress={prevSong}
          activeOpacity={0.7}
        >
          <MaterialIcons name="skip-previous" size={32} color="#6366f1" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlayPause}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name={status.playing ? 'pause-circle-filled' : 'play-circle-filled'}
            size={72}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={nextSong}
          activeOpacity={0.7}
        >
          <MaterialIcons name="skip-next" size={32} color="#6366f1" />
        </TouchableOpacity>
      </View>
      <View style={styles.queueContainer}>  
        <Text style={styles.queueTitle}>Up Next</Text>
        {parsedSongs[(currentIndex + 1) % parsedSongs.length] && (
          <Text style={styles.nextSongText}>
            {formatSongName(
              parsedSongs[(currentIndex + 1) % parsedSongs.length].name
            )}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

export default Player

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  albumArtContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  songDetailsContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  trackNumber: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  progressContainer: {
    marginBottom: 32,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 32,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  queueContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  queueTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  nextSongText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
});