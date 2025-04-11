import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { searchMovies } from './services/api.js'; // ajuste o caminho

const MovieListScreen = () => {
  const [searchTerm, setSearchTerm] = useState('batman');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchMovies = async () => {
    console.log(searchTerm)
    try {
      setLoading(true);
      setError(null);
      const results = await searchMovies(searchTerm);
      console.log(results)

      setMovies(results || []);
    } catch (error) {
      setMovies([])
      setError(error.message || 'Não foi possível carregar os filmes');
      Alert.alert('Erro', error.message || 'Não foi possível carregar os filmes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMovies()
  }, [])


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmes</Text>

      <TextInput
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={fetchMovies}
        placeholder="Buscar filmes..."
      />

      {loading && <ActivityIndicator size="large" color="#333" />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/100x150' }}
              style={styles.poster}
            />
            <View style={styles.info}>
              <Text style={styles.movieTitle}>{item.Title}</Text>
              <Text style={styles.movieYear}>{item.Year}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default MovieListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden'
  },
  poster: {
    width: 100,
    height: 150
  },
  info: {
    padding: 10,
    flex: 1
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  movieYear: {
    fontSize: 16,
    color: '#666',
    marginTop: 4
  }
});
